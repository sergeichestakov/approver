# Approver

GitHub bot that approves your PRs for you.

### Running

[![Run on Repl.it](https://repl.it/badge/github/sergeichestakov/approver)](https://repl.it/github/sergeichestakov/approver)

1. Get a [personal access token](https://github.com/settings/tokens/new) with repo permissions from the spare GitHub account you have lying around. At Repl.it, we use [@replbot](https://github.com/replbot). Make sure your bot has access to the org/repos you want it to work in.
2. Create a `.env` file with the format `TOKEN="YOUR_TOKEN_HERE"`.
3. Host this project on Repl.it (or fork [my repl](https://repl.it/@SergeiChestakov/approver)!) and hit "Run".
4. You can enable [Keeper Upper](https://docs.repl.it/misc/General-FAQ#how-do-i-keep-my-repls-to-always-stay-on) to keep it running in the background.

From there, you can simply add the "approve" label to any PR and it will get automatically approved without going through those pesky code reviews where they tell you to "add tests" and "write better code".

### Developing

Simply clone this repo and `yarn install`.

Alternatively, you can fork the repl [here](https://repl.it/@SergeiChestakov/approver).

