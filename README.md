# semantic-git-commit-cli

[![Build Status](https://travis-ci.org/JPeer264/node-semantic-git-commit-cli.svg?branch=master)](https://travis-ci.org/JPeer264/node-semantic-git-commit-cli) [![Coverage Status](https://coveralls.io/repos/github/JPeer264/node-semantic-git-commit-cli/badge.svg?branch=master)](https://coveralls.io/github/JPeer264/node-semantic-git-commit-cli?branch=master)

> A CLI to keep semantic git commits. With emoji support 😄 👍

## Why?

Many projects got different git commit rules. It is hard to remember them all.

## Usage

```sh
$ npm i -g MODULE_NAME
```
or
```sh
$ yarn add global MODULE_NAME
```

After installation it is available in your shell as:
```sh
$ semantic-git-commit
```
or even shorter:
```sh
$ sgc
```

## Config

> Just create a `.sgcrc` in your project root or you can add everything in your `package.json` with the value `sgc`

### Types

> Types will define your git commits.

**Keys**

- `prefix` - This will be your commit convention and will be your start of your commit - e.g.: `Feat:`
- `description` (optional) - The description to explain what your prefix is about
- `emoji` (optional) - An emoji which will be appended at the beginning of the commit ([Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet/))

The `.sgcrc`:

```json
{
    "types": [
      {
        "emoji": ":sparkles:",
        "prefix": "Feat:",
        "description": "Any description to describe the prefix"
      }
    ]
}
```

The `package.json`:

```json
{
    "name": "Your application name",
    "version": "1.0.0",
    "sgc": {
        "types": [
            {
              "emoji": ":sparkles:",
              "prefix": "Feat:",
              "description": "Any description to describe the prefix"
            }
        ]
    }
}
```
