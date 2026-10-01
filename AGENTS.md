# Full Court — shared working notes

This file is the one set of instructions every AI agent on this project follows. Codex reads it directly; Claude Code reads it through `CLAUDE.md`. If the team agrees a new rule, it goes here so all three sessions pick it up on their next pull.

## The project

Full Court is an NBA trivia game: plain HTML, CSS and JavaScript in `index.html`, `styles.css` and `app.js`. No build step, no dependencies, no backend. It must keep working when `index.html` is opened straight from disk.

**Every push to `main` is live.** GitHub Pages serves `main` at https://nragavan3.github.io/neil-game/ within a minute or two. There is no staging site.

Three people work on it at once, each with their own agent: Sahil and Shahryar with Claude Code, Neil with Codex. Assume someone else has pushed since you last looked.

## Stay in sync

1. **Before touching any file**, run `bash scripts/sync.sh --status`. It fetches, lists what teammates pushed and which files changed, and pulls when that is safe.
   - Claude Code runs it automatically at session start and on every prompt (`.claude/settings.json`).
   - Codex has no such hook: run it at the start of every task and again before pushing.
2. If it reports new commits, re-read the files it lists. What you read earlier in the session is stale.
3. **Before every push:** `git pull --rebase --autostash origin main`, then `node scripts/check.mjs`, then push.
4. If the push is rejected, someone pushed first. Pull with rebase again and retry. Never force-push `main`.
5. Push small and often. Work that sits unpushed is invisible to the others and gets harder to merge by the hour.
6. On a conflict, keep both changes. If you cannot tell what the other change was for, stop and ask your human; do not resolve it by dropping the other side.

## Shipping

- **Small, self-contained change** (copy, styling, a new question): commit straight to `main` after syncing and checking.
- **Anything bigger** (game flow, scoring, restructuring, a change across most of a file): work on a branch named `yourname/short-topic`, open a pull request, and have one other person look before merging.
- One logical change per commit. The message says what changed and why in plain words. Agents add their co-author trailer.
- After pushing to `main`, load the live site and play one question.

## Avoiding collisions

- `app.js` and `styles.css` are mostly very long single lines, so two people editing the same file will usually conflict even when they change different things. Say in the team chat what you are about to touch, and keep edits small.
- Add new CSS as new lines at the end of `styles.css`, and new JavaScript helpers as new lines, instead of growing the long lines.
- Do not reformat, re-indent or re-minify a file as a side effect of another change. A formatting-only change goes in its own commit, announced to the team first.
- Before renaming an `id` or class, search all three files; `app.js` looks elements up by id.

## Checks

`node scripts/check.mjs` must pass before every push. It checks that `app.js` parses, there are no merge conflict markers, every file and element id the page relies on exists, and the question bank is well formed. GitHub runs the same check on every push and pull request; a red result on `main` means the live site may be broken, so fix it before anything else.

## Conventions

- Vanilla JavaScript only. No frameworks, packages, trackers or external scripts.
- Keep the accessibility behaviour: keyboard answers 1–4, the `aria-live` feedback region, and `prefers-reduced-motion`.
- Questions: historical facts only, nothing that changes season to season. Each needs `level` (0 rookie, 1 all-star, 2 legend), `category`, `q`, four answers in `a`, the index of the right one in `c`, and a one-line explanation in `f`. Keep at least four per level.
- This is an independent fan project. No NBA or team logos or other official assets.

## Team notes

Things worth knowing that the code does not show. Add a dated line when you learn something that would save the next person time, and delete lines that stop being true.

- 2026-10-01: Browsers cache `app.js` and `styles.css`; hard-refresh the live site to see a fresh push.
