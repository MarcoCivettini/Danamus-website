#!/usr/bin/env bash
# PreToolUse hook: blocks pushes until the security review for the current HEAD is done.
# Claude records a completed review with: git rev-parse HEAD > .claude/.security-review-ok
set -euo pipefail

input="$(cat)"
tool="$(jq -r '.tool_name // ""' <<<"$input")"
cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

deny() {
  jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
  exit 0
}

case "$tool" in
  mcp__github__push_files|mcp__github__create_or_update_file|mcp__github__delete_file)
    deny "Push via GitHub API is disabled in this repo: commit locally and use git push, so the pre-push security review runs."
    ;;
  Bash)
    cmd="$(jq -r '.tool_input.command // ""' <<<"$input")"
    # Match "git push" and "git -C <dir> push" etc.
    if ! grep -qE '(^|[;&|[:space:]])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+push([[:space:]]|$)' <<<"$cmd"; then
      exit 0
    fi
    head="$(git rev-parse HEAD 2>/dev/null || echo none)"
    reviewed="$(cat .claude/.security-review-ok 2>/dev/null || true)"
    if [[ "$head" == "$reviewed" ]]; then
      exit 0
    fi
    base="$(git merge-base HEAD origin/main 2>/dev/null || echo origin/main)"
    deny "Security review required before push (HEAD $head not reviewed). Use the security-audit skill in guidance mode on the changes being pushed: git diff $base...HEAD (plus any new dependencies, MCP/skill/hook config and secrets). Report findings to the user and fix or get approval for any real issue. Only then run: git rev-parse HEAD > .claude/.security-review-ok and retry the push."
    ;;
esac
exit 0
