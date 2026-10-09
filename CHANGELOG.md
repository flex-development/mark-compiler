## [1.0.0-alpha.5](https://github.com/flex-development/mark-compiler/compare/1.0.0-alpha.4...1.0.0-alpha.5) (2026-10-09)

### ⚠ BREAKING CHANGES

- project rename
- `@flex-development/fsm` integration

### :package: Build

- [[`cb2b28b`](https://github.com/flex-development/mark-compiler/commit/cb2b28b5592f2d18e7c77f4ee79cee48461f18fc)] **deps-dev:** Bump @arethetypeswrong/cli from 0.18.3 to 0.18.4 ([#20](https://github.com/flex-development/mark-compiler/issues/20))
- [[`006e1b5`](https://github.com/flex-development/mark-compiler/commit/006e1b50ffae4066ab3088d4d33aed01ab474a87)] **deps-dev:** Bump @commitlint/cli from 21.2.0 to 21.2.1 in the commitlint group ([#31](https://github.com/flex-development/mark-compiler/issues/31))
- [[`f827976`](https://github.com/flex-development/mark-compiler/commit/f827976858ab7a81ce36d258903eae0d427c5eb9)] **deps-dev:** Bump dprint from 0.54.0 to 0.55.2 ([#36](https://github.com/flex-development/mark-compiler/issues/36))
- [[`2a2510e`](https://github.com/flex-development/mark-compiler/commit/2a2510ee70f4b1f220165d0140132d7a997a1d54)] **deps-dev:** Bump happy-dom from 20.10.2 to 20.10.3 ([#12](https://github.com/flex-development/mark-compiler/issues/12))
- [[`de04220`](https://github.com/flex-development/mark-compiler/commit/de0422013d9f3f99836e932f2b07e1aa3319a0b0)] **deps-dev:** Bump happy-dom from 20.10.3 to 20.10.4 ([#15](https://github.com/flex-development/mark-compiler/issues/15))
- [[`3634465`](https://github.com/flex-development/mark-compiler/commit/363446579971acb3f8ad812a8130d3c3f5ac4b73)] **deps-dev:** Bump happy-dom from 20.10.4 to 20.10.5 ([#16](https://github.com/flex-development/mark-compiler/issues/16))
- [[`d90e7b8`](https://github.com/flex-development/mark-compiler/commit/d90e7b83465a3aaecbc4c5caba6812588f6037c9)] **deps-dev:** Bump happy-dom from 20.10.5 to 20.10.6 ([#17](https://github.com/flex-development/mark-compiler/issues/17))
- [[`c9382b6`](https://github.com/flex-development/mark-compiler/commit/c9382b65a571378c21819dced26d6dc15be21f72)] **deps-dev:** Bump happy-dom from 20.10.6 to 20.11.0 ([#37](https://github.com/flex-development/mark-compiler/issues/37))
- [[`a63f8b2`](https://github.com/flex-development/mark-compiler/commit/a63f8b29b36b2b2b029e367579f6e6804975dfd1)] **deps-dev:** Bump happy-dom from 20.11.0 to 20.11.1 ([#39](https://github.com/flex-development/mark-compiler/issues/39))
- [[`0e9747e`](https://github.com/flex-development/mark-compiler/commit/0e9747e52189c2bb4f1e0a0514e3ab78958f5140)] **deps-dev:** Bump rollup from 4.61.1 to 4.62.0 ([#13](https://github.com/flex-development/mark-compiler/issues/13))
- [[`f105a12`](https://github.com/flex-development/mark-compiler/commit/f105a127c7054aeeb42162ae86a26f55a36aecca)] **deps-dev:** Bump rollup from 4.62.0 to 4.62.3 ([#41](https://github.com/flex-development/mark-compiler/issues/41))
- [[`f9ce564`](https://github.com/flex-development/mark-compiler/commit/f9ce564a701cc8445ad0bc7e72ce1547dc56570c)] **deps-dev:** Bump sh-syntax from 0.5.8 to 0.6.0 ([#30](https://github.com/flex-development/mark-compiler/issues/30))
- [[`078db6f`](https://github.com/flex-development/mark-compiler/commit/078db6f21a394b516496bf18a768c723534eea83)] **deps-dev:** Bump the commitlint group across 1 directory with 2 updates ([#22](https://github.com/flex-development/mark-compiler/issues/22))
- [[`d106872`](https://github.com/flex-development/mark-compiler/commit/d1068728b051a6e0183803c6fbbe5da27e1637ac)] **deps-dev:** Bump the commitlint group with 2 updates ([#26](https://github.com/flex-development/mark-compiler/issues/26))
- [[`d37ff83`](https://github.com/flex-development/mark-compiler/commit/d37ff8323bd6574d6c3519c08f48ffc3a5fc5ddf)] **deps-dev:** Bump the vitest group with 3 updates ([#14](https://github.com/flex-development/mark-compiler/issues/14))
- [[`90b07b2`](https://github.com/flex-development/mark-compiler/commit/90b07b2e893a4a0ab4449b3289f88b81437870a9)] **deps-dev:** Bump the vitest group with 3 updates ([#29](https://github.com/flex-development/mark-compiler/issues/29))
- [[`9f07e10`](https://github.com/flex-development/mark-compiler/commit/9f07e100a8f65521a1e0877e3aa68b01fd3a2f04)] **deps-dev:** Bump tsx from 4.22.4 to 4.22.5 ([#27](https://github.com/flex-development/mark-compiler/issues/27))
- [[`2bd597f`](https://github.com/flex-development/mark-compiler/commit/2bd597f9923578a5187c0e8e0906ca419e5a6c77)] **deps-dev:** Bump tsx from 4.22.5 to 4.23.0 ([#28](https://github.com/flex-development/mark-compiler/issues/28))
- [[`f1e8a8a`](https://github.com/flex-development/mark-compiler/commit/f1e8a8accc0a78c7eb207b89aa4b8bd5742f0c16)] **deps-dev:** Bump tsx from 4.23.0 to 4.23.1 ([#34](https://github.com/flex-development/mark-compiler/issues/34))

### :robot: Continuous Integration

- [[`7c5429f`](https://github.com/flex-development/mark-compiler/commit/7c5429fe7d32665f4e555919a064c9eb9c674f0d)] **deps:** Bump actions/cache from 5.0.5 to 6.0.0 ([#21](https://github.com/flex-development/mark-compiler/issues/21))
- [[`b35a1e7`](https://github.com/flex-development/mark-compiler/commit/b35a1e7c06c6d1e7e1e9f10f267a32bff5475a03)] **deps:** Bump actions/cache from 6.0.0 to 6.1.0 ([#23](https://github.com/flex-development/mark-compiler/issues/23))
- [[`bf63fd2`](https://github.com/flex-development/mark-compiler/commit/bf63fd24e16cec262b881122183ab7c0c0611b1d)] **deps:** Bump actions/checkout from 6.0.3 to 7.0.0 ([#18](https://github.com/flex-development/mark-compiler/issues/18))
- [[`32251d7`](https://github.com/flex-development/mark-compiler/commit/32251d7c9dae1409ec8bf01196d689ba5b813401)] **deps:** Bump actions/checkout from 7.0.0 to 7.0.1 ([#38](https://github.com/flex-development/mark-compiler/issues/38))
- [[`2e4485b`](https://github.com/flex-development/mark-compiler/commit/2e4485b1c38e819bbf2ffd54c36a01c95eaa240c)] **deps:** Bump actions/setup-node from 6.4.0 to 7.0.0 ([#35](https://github.com/flex-development/mark-compiler/issues/35))

### :pencil: Documentation

- [[`46f9785`](https://github.com/flex-development/mark-compiler/commit/46f97851f05783ea1e5bffe116b8cceadd8eb086)] fix `LICENSE` year

### :house_with_garden: Housekeeping

- [[`849cd5d`](https://github.com/flex-development/mark-compiler/commit/849cd5d0cc7c3c3b034d16d5d0de2379c29262ed)] **build:** cleanup package `imports`

### :mechanical_arm: Refactors

- [[`25fd6b1`](https://github.com/flex-development/mark-compiler/commit/25fd6b14331b7620315db46b866586c21bb17211)] `@flex-development/fsm` integration
- [[`d5484b4`](https://github.com/flex-development/mark-compiler/commit/d5484b4e9f64143164f87c105ef7b388b0993979)] project rename

## [1.0.0-alpha.4](https://github.com/flex-development/mark-compiler/compare/1.0.0-alpha.3...1.0.0-alpha.4) (2026-06-11)

### :pencil: Documentation

- [[`ace80a9`](https://github.com/flex-development/mark-compiler/commit/ace80a978fc6afb854c04ef499d0165c164bd15a)] version, sponsor

### :sparkles: Features

- [[`71f2c6d`](https://github.com/flex-development/mark-compiler/commit/71f2c6db0a745632d8952aa169064e70d794176c)] **ts:** `CompileContext#from`

## [1.0.0-alpha.3](https://github.com/flex-development/mark-compiler/compare/1.0.0-alpha.2...1.0.0-alpha.3) (2026-06-11)

### :house_with_garden: Housekeeping

- [[`9005284`](https://github.com/flex-development/mark-compiler/commit/9005284a20c09058304fc6421fa9d762b3846a55)] add `CHANGELOG` entry for `1.0.0-alpha.2`

### :mechanical_arm: Refactors

- [[`45a8f8a`](https://github.com/flex-development/mark-compiler/commit/45a8f8a9f6acb3474ba313952dc1b7a4f8bd4737)] **ts:** api improvements

## [1.0.0-alpha.2](https://github.com/flex-development/mark-tokenizer/compare/1.0.0-alpha.1...1.0.0-alpha.2) (2026-06-11)

## 1.0.0-alpha.1 (2026-06-11)

### :package: Build

- [[`49677fc`](https://github.com/flex-development/mark-compiler/commit/49677fcdd13f399c5f6efc65c37c04872b33e8d8)] **deps-dev:** Bump ts-dedent from 2.2.0 to 2.3.0 ([#2](https://github.com/flex-development/mark-compiler/issues/2))

### :sparkles: Features

- [[`0085798`](https://github.com/flex-development/mark-compiler/commit/00857983e605900b36dcc78d94b242eace91c4a3)] `createCompiler`
- [[`b9166b9`](https://github.com/flex-development/mark-compiler/commit/b9166b94be7ba115f5fb86bc7d94aa86f42f4d93)] **ts:** `CompileContext`

### :house_with_garden: Housekeeping

- [[`1dbbbdb`](https://github.com/flex-development/mark-compiler/commit/1dbbbdb4197bbf31530d57e3a8c67d9958deb543)] initial commit






