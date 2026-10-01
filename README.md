# Full Court — NBA Trivia

A responsive, browser-only basketball trivia game built with HTML, CSS, and vanilla JavaScript.

## Play locally

Open `index.html` directly, or run `python3 -m http.server 8000` in this directory and visit http://localhost:8000.

## GitHub Pages

Push these files to your repository. In **Settings → Pages**, choose **Deploy from a branch**, select your branch and **/ (root)**, and save. The game uses relative paths and requires no build step or backend.

## Working on it together

Several people and their AI agents push to this repo, and every push to `main` goes live. The rules everyone follows are in [AGENTS.md](AGENTS.md). In short: run `bash scripts/sync.sh --status` before you start, and `git pull --rebase --autostash origin main` then `node scripts/check.mjs` before you push.

## Features

- 12 randomized questions drawn from a 24-question historical NBA bank
- Rookie, All-Star, and Legend difficulty stages
- 20-second shot clock, immediate feedback, and answer explanations
- Score, streak bonuses, accuracy, final results, and replay
- Personal best saved locally when browser storage is available
- Optional synthesized sound, keyboard answers (1–4), reduced-motion support
- Responsive layouts, original CSS/SVG basketball artwork

Scoring: correct answers earn 100, 150, or 200 points by difficulty, plus 25 points for each preceding correct answer in the current streak. Incorrect or expired answers reset the streak. Google Fonts are optional; the interface has local font fallbacks. No accounts, tracking, or external JavaScript dependencies.

Independent fan project; not affiliated with the NBA.
