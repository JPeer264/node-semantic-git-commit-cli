# semantic-git-commit-cli

[![Build Status](https://travis-ci.org/JPeer264/node-semantic-git-commit-cli.svg?branch=master)](https://travis-ci.org/JPeer264/node-semantic-git-commit-cli)
[![Build status](https://ci.appveyor.com/api/projects/status/t9xwo0r3n2oe5ywf/branch/master?svg=true)](https://ci.appveyor.com/project/JPeer264/node-semantic-git-commit-cli/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/JPeer264/node-semantic-git-commit-cli/badge.svg?branch=master)](https://coveralls.io/github/JPeer264/node-semantic-git-commit-cli?branch=master)


> A CLI to keep semantic git commits. With emoji support 😄 👍

<img src="https://raw.githubusercontent.com/JPeer264/node-semantic-git-commit-cli/master/media/screenshot.gif">

## Why?

Many projects got different git commit rules. It is hard to remember them all.

## Installation

```sh
$ npm i -g semantic-git-commit-cli
```
or
```sh
$ yarn add global semantic-git-commit-cli
```

## Usage

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

You can even create a global config. Just go to your users home and create a `.sgcrc`. The global config will be triggered if no project configurations are present.

**Options:**
- [questions](#questions)
- [emoji](#emoji)
- [types](#types)
- [rules](#rules)

### questions

**Type:** `object`

**Options:**
- `scope` Asks for the scope in parentheses of the commit. Default: `false`
- `moreInfo` Asks if more info (body) should be added. Default: `true`

An object with predefined settings, what should be asked.

Example:
```js
{
  "questions": {
    "scope": true
  }
}
```

### emoji

**Type:** `boolean`

**Default:** `true`

A boolean to enable emoji at the beginning of a commit message

Example:
```json
{
  "emoji": true
}
```

### types

> Types will define your git commits.

**Keys**

- `type` - This will be your commit convention and will be your start of your commit - e.g.: `Feat:`
- `description` (optional) - The description to explain what your type is about
- `emoji` (optional) - An emoji which will be appended at the beginning of the commit ([Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet/))

The `.sgcrc`:

```json
{
    "types": [
      {
        "emoji": ":sparkles:",
        "type": "Feat:",
        "description": "Any description to describe the type"
      }
    ]
}
```

or the `package.json`:

```json
{
    "name": "Your application name",
    "version": "1.0.0",
    "sgc": {
        "types": [
            {
              "emoji": ":sparkles:",
              "type": "Feat:",
              "description": "Any description to describe the type"
            }
        ]
    }
}
```

### rules

Available rules:

- [max-char](#max-char)
- [min-char](#min-char)
- [end-with-dot](#end-with-dot)

#### max-char

**Type:** `number`

**Default:** `undefined`

If a number is set, it will not allow to commit messages **more than** the given number

Example:
```json
{
  "rules": {
    "max-char": 10
  }
}
```

#### min-char

**Type:** `number`

**Default:** `undefined`

If a number is set, it will not allow to commit messages **less than** the given number

Example:
```json
{
  "rules": {
    "min-char": 10
  }
}
```

#### end-with-dot

**Type:** `boolean`

**Default:** `true`

If it is set to false, it will not allow to commit messages with a dot at the

Example:
```json
{
  "rules": {
    "end-with-dot": false
  }
}
```
