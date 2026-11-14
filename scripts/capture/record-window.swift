// Records a single macOS window with ScreenCaptureKit. Only that window's
// pixels are captured: notifications, the menu bar, the Dock and other apps
// never appear in the video, even if they overlap the window.
//
// Usage:
//   swift scripts/capture/record-window.swift --list
//   swift scripts/capture/record-window.swift <window-id> <seconds> <out.mov>
//
// Needs the Screen Recording permission for the app that runs the command.
import AVFoundation
import CoreMedia
import Foundation
import ScreenCaptureKit

final class Recorder: NSObject, SCStreamOutput {
    let writer: AVAssetWriter
    let input: AVAssetWriterInput
    var started = false

    init(url: URL, width: Int, height: Int) throws {
        try? FileManager.default.removeItem(at: url)
        writer = try AVAssetWriter(outputURL: url, fileType: .mov)
        input = AVAssetWriterInput(mediaType: .video, outputSettings: [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: width,
            AVVideoHeightKey: height,
            AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 40_000_000],
        ])
        input.expectsMediaDataInRealTime = true
        writer.add(input)
    }

    func stream(_ stream: SCStream, didOutputSampleBuffer buffer: CMSampleBuffer, of type: SCStreamOutputType) {
        guard type == .screen, buffer.isValid,
              let attachments = CMSampleBufferGetSampleAttachmentsArray(buffer, createIfNecessary: false) as? [[SCStreamFrameInfo: Any]],
              let raw = attachments.first?[.status] as? Int,
              SCFrameStatus(rawValue: raw) == .complete else { return }
        if !started {
            writer.startWriting()
            writer.startSession(atSourceTime: buffer.presentationTimeStamp)
            started = true
        }
        if input.isReadyForMoreMediaData { input.append(buffer) }
    }
}

let args = CommandLine.arguments
let content = try await SCShareableContent.excludingDesktopWindows(true, onScreenWindowsOnly: true)

if args.count == 2 && args[1] == "--list" {
    for w in content.windows where w.isOnScreen && w.windowLayer == 0 {
        print("\(w.windowID)\t\(w.owningApplication?.applicationName ?? "?")\t\(w.title ?? "")\t\(Int(w.frame.width))x\(Int(w.frame.height))")
    }
    exit(0)
}
guard args.count == 4, let id = UInt32(args[1]), let seconds = Double(args[2]) else {
    print("usage: record-window.swift --list | <window-id> <seconds> <out.mov>")
    exit(2)
}
guard let window = content.windows.first(where: { $0.windowID == id }) else {
    print("window \(id) not found")
    exit(1)
}

let filter = SCContentFilter(desktopIndependentWindow: window)
let scale = Int(filter.pointPixelScale)
let config = SCStreamConfiguration()
config.width = Int(window.frame.width) * scale
config.height = Int(window.frame.height) * scale
config.minimumFrameInterval = CMTime(value: 1, timescale: 60)
config.showsCursor = false
config.capturesAudio = false
config.ignoreShadowsSingleWindow = true

let recorder = try Recorder(url: URL(fileURLWithPath: args[3]), width: config.width, height: config.height)
let stream = SCStream(filter: filter, configuration: config, delegate: nil)
try stream.addStreamOutput(recorder, type: .screen, sampleHandlerQueue: DispatchQueue(label: "frames"))
try await stream.startCapture()
print("recording window \(id) at \(config.width)x\(config.height) for \(seconds)s")
try await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
try await stream.stopCapture()
recorder.input.markAsFinished()
await recorder.writer.finishWriting()
print("wrote \(args[3])")
