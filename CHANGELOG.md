3.2.1 - March, 15 2019

* bbc1a17 Fix: target to the correct entrypoint (JPeer264)

3.2.0 - March, 11 2019

* 89de027 Feat: sgc with parameters (closes #70) (#73) (Jan Peer Stöcklmair)
* 786c6d3 Feat: sgc --retry (closes #65) (#69) (Jan Peer Stöcklmair)

3.1.1 - December, 14 2018

* 93ce722 Chore: update inquirer (#72) (Jan Peer Stöcklmair)
* b30c854 Chore: move to babel7 (#68) (Jan Peer Stöcklmair)

3.1.0 - October, 15 2018

* c3de4e5 Feature: Prefer dynamic `sgc.config.js` over static `.sgcrc` (#67) (Stephan Schubert)
* 6631218 Feat: throw on not valid route (#63) (Jan Peer Stöcklmair)
* ff40a4c docs: update rules docs to reflect change. Fixes #61 (#62) (Martin Muzatko)

3.0.2 - June, 19 2018

* c5506fa Fix: call sgc after initCommit No (closes #54) (#59) (Jan Peer Stöcklmair)

3.0.1 - January, 24 2018

* d325a89 Fix: wrong value for initialCommit (#58) (Jan Peer Stöcklmair)
* edbb6d9 Docs: fix initial-commit change (#57) (Jan Peer Stöcklmair)
* a878812 Update README.md (#56) (jy95)

3.0.0 - January, 05 2018

* fb01392 Chore: drop Node v4 (#55) (Jan Peer Stöcklmair)
* c5b5941 Docs: link semantic-release (#52) (Jan Peer Stöcklmair)
* ba91f6a CI: test node version 8 (#50) (Lukas Aichbauer)
* 866cffd Style: use consistent writing style (closes #43) (#48) (Lukas Aichbauer)
* 540af59 Docs: recover changelog (#47) (Jan Peer Stöcklmair)

2.3.1 - October, 01 2017

 * f37923b Fix: apply length check on type + scope + message (closes #35) (#42) (Lukas Aichbauer)
 * 67892ae Fix: trim trailing spaces (closes #39) (#41) (Lukas Aichbauer)
 * 8b8fe39 Docs: Fix typo on installation with yarn (closes #45) (#46) (Guillermo Omar Lopez Lopez)

2.3.0 - September, 11 2017

 * 5befc1b Docs: for lowercaseTypes (closes #34) (#44) (Lukas Aichbauer)
 * b28add9 Feat: show commit msg length (closes #36) (#40) (Lukas Aichbauer)
 * 270d752 Docs: add usage with semantic-release (#38) (jy95)

2.2.0 - August, 10 2017

 * 216fd4d Feat: lowercase types (closes #32) (#33) (Lukas Aichbauer)

2.1.0 - May, 15 2017

 * 3ca438c Feat: init commit (#28) (Lukas Aichbauer)
 * 6cc8d7d Docs: update screenshot to 2.0.0 (JPeer264)

2.0.1 - May, 07 2017

 * fc739da Docs: improved why (JPeer264)

2.0.0 - May, 06 2017

 * c3baf46 CI: change travis email on_success change (JPeer264)
 * bf1bcf6 Test: change min-char to max-char (JPeer264)
 * 6c245c0 CI: change npm install to yarn (JPeer264)
 * 2643477 Refactor: remove one liner ifs (JPeer264)
 * 0db6844 Refactor: change function behavior (JPeer264)
 * e9805dc Feat: change min/maxChar disable function to -1 (JPeer264)
 * a02bd55 Refactor: change function behavior (JPeer264)
 * cd322a9 Feat: remove inherit, change readme defaults (JPeer264)
 * 31e6578 Refactor: get defaults from our config (JPeer264)
 * ed721af Refactor: remove if-condition (JPeer264)
 * a1dbbe4 Fix: improve body prompt (JPeer264)
 * 6ff0403 Refactor: rename moreInfo to body (JPeer264)
 * d2e8b57 Test: add confirm test (JPeer264)
 * 1800c8e Fix: remove whitespace in <Type>(<scope>): (JPeer264)
 * 9a374e3 Test: better test description (JPeer264)
 * 9cf843c Fix: check for whitespaces in scope (JPeer264)
 * b726219 Test: helpers -> helper due to ava does not trigger helper (JPeer264)
 * f4806a5 Test: add testcase (JPeer264)
 * cfafcc1 Docs: change the emoji default to false (JPeer264)
 * 602c769 Feat: add inherit mode (fixes #26) (JPeer264)
 * 944d286 Feat: added local config for future contributors (JPeer264)
 * 471632a Feat: remove Init type (fixes #25) (JPeer264)
 * 88bd97e Fix: change emojies plural to emoji (JPeer264)
 * 1ca3d30 Feat: change emoji default to false (JPeer264)
 * d59514a :sparkles: Feat: add scope and default values (fixes #18) (JPeer264)
 * d150c5e :hammer: Refactor: update param in questions (JPeer264)
 * 409e865 :hammer: Refactor: rename promptConfig to questions (JPeer264)

1.4.0 - April, 18 2017

 * 039b1d5 :white_check_mark: Test: change to serial tests (JPeer264)
 * db6978b :memo: Docs: set emojie default to true (JPeer264)
 * 5026299 :wrench: Chore: update is-git-added (JPeer264)
 * 9b615eb :white_check_mark: Test: update test to serial (JPeer264)
 * ecb1d74 :bug: Fix: change emojies default to true (JPeer264)
 * 5b8c15d :white_check_mark: Test: rename typo test (JPeer264)
 * 2014e8e :art: Style: change return into one liner (JPeer264)
 * fed34f0 :sparkles: Feat: just run sgc if files are really added (JPeer264)
 * ab20d9a :wrench: Chore: add is-git-added (JPeer264)
 * c005eb0 1.3.2 (JPeer264)
 * 0d319bb :bug: Fix: add emojies by default (JPeer264)
 * 923e147 Feat: add option to disable emojies (JPeer264)
 * 5e29cd4 :wrench: Chore: remove unnecessary async/await (JPeer264)

1.3.2 - October, 01 2017

 * e967966 :bug: Fix: change error message, and add stdio for a better output (fixes #21) (JPeer264)

1.3.1 - April, 07 2017

 * c03ee1d :sparkles: Feat: add sgc type init for initial commit (rudolfsonjunior)

1.3.0 - March, 23 2017

 * 1d57058 :memo: Docs: add appveyor badge (JPeer264)
 * dcf46aa :construction_worker: CI: add appveyor (JPeer264)
 * c5b5550 :hammer: Refactor: add datetime to testfiles (JPeer264)
 * 2fba853 :bug: Fix: works on windows (JPeer264)
 * deb1c1a :hammer: Refactor: reorder imports (JPeer264)
 * fa7fb37 :white_check_mark: Test: add before and after test (JPeer264)
 * c2de1b6 :bug: Fix: change git-utils to is-git-repository (JPeer264)
 * 6d70d5f :wrench: Chore: add is-git-repository (JPeer264)
 * e0e2258 :sparkles: Feat: fail on non git (JPeer264)
 * 316bcbe :wrench: Chore: add git-util, add run-babel in pretest (JPeer264)

1.2.1 - March, 23 2017

 * cec8984 :memo: Docs: fix gif path for npm website (rudolfsonjunior)
 * 7c90586 :memo: Docs: split usage to installation and usage (JPeer264)

1.2.0 - March, 19 2017

 * fbe667f :memo: Docs: add npm description (JPeer264)
 * 724f7ee :memo: Docs: add rules into docs (JPeer264)
 * 161a972 :art: Style: removed {} from one-line stmt (rudolfsonjunior)
 * 3b4c788 :white_check_mark: Test: add test for uncovered lines 44,45 lib/promptConfig (rudolfsonjunior)
 * 140bc96 :white_check_mark: Test: add tests for rules/availableRules.js and rules/ruleWarningMessages.js (rudolfsonjunior)
 * 3400b63 :bug: Fix: remove Ï character from test/fixtures/.sgrc (rudolfsonjunior)
 * 5fccb4e :white_check_mark: Test: change validate functions in questions (rudolfsonjunior)
 * 3166dbf :hammer: Refactor: add rule for .sgcrc fixtures (rudolfsonjunior)
 * 5fae00e :wrench: Chore: add package object.entries (rudolfsonjunior)
 * c44f0c3 :hammer: Refactor: add the ruleWarningMessages (rudolfsonjunior)
 * cda32d1 :hammer: Refactor: delete test and lib/rulesConfig.js (rudolfsonjunior)
 * 3032d98 :art: Style: rules in .sgrc_default (rudolfsonjunior)
 * 2775287 :art: Style: remove trailing comma (rudolfsonjunior)
 * 99527bf :white_check_mark: Test: add test for new rules (rudolfsonjunior)
 * 67525e2 :sparkles: Feat: add rules max-char, min-char, end-with-dot (rudolfsonjunior)
 * f978ec9 :wrench: Chore: add babel-polyfill for async await for tests (rudolfsonjunior)
 * 6bbb556 :bug: Fix: remove global sgcrc before test and revert it after (#12) (JPeer264)
 * e59ccaa :memo: Docs: add keywords (JPeer264)

1.1.0 - March, 18 2017

 * 2c5d4d5 :sparkles: Feat: add -v and -h flags (JPeer264)
 * a7ae4df :memo: Docs: add global config description (JPeer264)
 * 5aac51f :sparkles: Feat: load global config (JPeer264)
 * 8a5a54a :sparkles: Feat: add update-notifier to cli (JPeer264)
 * 78f14e5 :wrench: Chore: add update-notifier (JPeer264)
 * 610a30d :bug: Fix: add media in npm (JPeer264)

1.0.2 - March, 17 2017

 * 69a23f2 :bug: Fix: wrong git commit error message (JPeer264)
 * 23b6668 1.0.1 (JPeer264)
 * cf3ae13 :bug: Fix: run babel as prepublish (JPeer264)
 * 57a3dbc :bug: Fix: run babel as prepublish (JPeer264)
 * 3f5a2af 1.0.0 (JPeer264)
 * 67e5a6b :wrench: Chore: update npm scripts (JPeer264)
 * 7af4710 :bug: Fix: shorten commit messages (#7) (JPeer264)
 * 0da149a :bug: Fix: provided a choices param (rudolfsonjunior)
 * 965ec99 :white_check_mark: Test: changed config to getConfig direct (rudolfsonjunior)
 * d176c8f :hammer: Refactor: changed config to import getConfig directly (rudolfsonjunior)
 * e4284b3 :white_check_mark: Test: update test for promptConfig (rudolfsonjunior)
 * 1d5b0de :wrench: Chore: remove unused bdd-stdin dependency (rudolfsonjunior)
 * a572ee2 :hammer: Refactor: change promptConfig from export default to named exports (rudolfsonjunior)
 * d6e6076 :hammer: Refactor: move prompt from lib/promptConfig to lib/cli (rudolfsonjunior)
 * 3c17c1d :bug: Fix: change includes for node 4 support (rudolfsonjunior)
 * 4e5408d :white_check_mark: Test: correct test choices generated from .sgcrc_default (rudolfsonjunior)
 * 4352f3a :white_check_mark: Test: added all tests for prompt, delete test/sgcPromt and add test/promptConfig (rudolfsonjunior)
 * def9174 :wrench: Chore: add bdd-stdin for testing (rudolfsonjunior)
 * 0cb3060 :hammer: Refactor: delete sgcPromt.js and add promptConfig.js (rudolfsonjunior)
 * 9aa9c70 :hammer: Refactor: use new promtConfig file (rudolfsonjunior)
 * 551da9b :bug: Fix: remove strings in commit message (JPeer264)
 * 76917ab :memo: Docs: add screenshot gif (JPeer264)
 * c9a8cdf refactor: simplify validate statement (Daniel Scheffknecht)
 * 11a26e0 feat: make commit messages mandatory (Daniel Scheffknecht)
 * be60087 Update: prefix to type (closes #4) (JPeer264)
 * c56c0be :hammer: Refactor: changed path.join (rudolfsonjunior)
 * 564f4f4 :hammer: Refactor: skip test (rudolfsonjunior)
 * 67e778e :hammer: Refactor: changed test promise to sync (rudolfsonjunior)
 * d231010 :wrench: Chore: change lint - tests to test (rudolfsonjunior)
 * a7ed0ec :white_check_mark: Test: update test for package.json, fs-extra (rudolfsonjunior)
 * ca85dad :wrench: Chore: add fs-extra (rudolfsonjunior)
 * bf7665d :bug: Fix: updated stmt, pass with altPath, package.json and .sgcrc_default (rudolfsonjunior)
 * 9814eef :white_check_mark: Test: add test for .sgcrc_default, updated test for package.json .sgc (rudolfsonjunior)
 * 4de8063 :wrench: Refactor: remove package.json .sgc (rudolfsonjunior)
 * 34af0be :hammer: Refactor: change sgc.types.prefix to sgc.types.type (rudolfsonjunior)
 * b7f9c79 :hammer: Refactor: delete Add: from types (rudolfsonjunior)
 * cdfb5c3 :ok_hand: Fix: add ! to if stmt (rudolfsonjunior)
 * 8e18b70 :ok_hand: Code Review: fixed the test types (rudolfsonjunior)
 * 718353a :sparkles: Feat: added all types for .sgcrc_default (rudolfsonjunior)
 * bc42f43 :bug: Fix: remove ! from first if stmt (rudolfsonjunior)
 * d03dca4 Update: add types and why section (JPeer264)
 * 756d9bf Feat: spawn commit (JPeer264)
 * 273138f Feat: add spawn (JPeer264)
 * 57d1631 Chore: add execa (JPeer264)
 * 8a8617c :wrench: Chore: changed precommit hook to prepush hook (rudolfsonjunior)
 * d2e2779 Add: inquirer prompt (JPeer264)
 * 199f9c3 Chore: chalk (JPeer264)
 * 25f52ea Add more default values (JPeer264)
 * b560890 Update: change name from plural to singular (JPeer264)
 * 25a9552 Chore/Fix: precommit (rudolfsonjunior)
 * 567b20d Chore: add husky for precommit hook (rudolfsonjunior)
 * 5c63fce Add getConfig (JPeer264)
 * 0124b5a Add sgcrc_default (JPeer264)
 * 11126f1 Add getCofig test (JPeer264)
 * 8ae80f0 Add: fixtures files (JPeer264)
 * 73b633f Chore: inquirer, json-extra as deps; sgc config added (JPeer264)

