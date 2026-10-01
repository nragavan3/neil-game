#!/usr/bin/env bash
# Pick up teammates' pushes. Safe to run at any time: it fast-forwards main when
# that cannot lose work, and otherwise only reports what changed and what to run.
# Prints nothing when already up to date, unless called with --status.
set -u

root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0
status=${1:-}

if ! GIT_TERMINAL_PROMPT=0 git fetch --quiet --prune origin 2>/dev/null; then
  echo "sync: could not reach GitHub, so this checkout may be behind. Run 'git fetch origin' before editing."
  exit 0
fi

branch=$(git symbolic-ref --quiet --short HEAD || echo "detached")
behind=$(git rev-list --count HEAD..origin/main)
ahead=$(git rev-list --count origin/main..HEAD)

if [ "$behind" -eq 0 ]; then
  if [ "$status" = "--status" ]; then
    echo "sync: up to date with origin/main (branch $branch, $ahead unpushed commit(s))."
    git status --short
  fi
  exit 0
fi

echo "sync: $behind new commit(s) on origin/main from teammates:"
git log --format='  %h %an, %ar: %s' HEAD..origin/main
echo "Files they changed:"
git diff --name-only HEAD...origin/main | sed 's/^/  /'

if [ "$branch" = "main" ] && [ "$ahead" -eq 0 ] && git merge --ff-only --quiet origin/main 2>/dev/null; then
  echo "Pulled: this checkout now has them. Re-read those files before editing; anything read earlier is stale."
else
  echo "NOT pulled (branch $branch, $ahead unpushed commit(s), or local edits overlap)."
  echo "Run 'git pull --rebase --autostash origin main' before editing those files or pushing."
fi
