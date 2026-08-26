# [2.0.0](https://github.com/taiatiniyara/mycash-js/compare/v1.0.0...v2.0.0) (2026-08-26)


* feat!: unify the SDK behind MyCashClient with an internal wire codec ([4d8a7d3](https://github.com/taiatiniyara/mycash-js/commit/4d8a7d3da957e5f6b09b0609cd1a7a10312dd9de))


### BREAKING CHANGES

* the core MyCash class is deprecated and will be
removed in v3.0. Use MyCashClient — it accepts the same config and
exposes paymentRequest, sendOtp, approvePayment, and pay.

# 1.0.0 (2026-08-25)


### Bug Fixes

* add base path for GitHub Pages subpath deployment ([c12f6fd](https://github.com/taiatiniyara/mycash-js/commit/c12f6fd0bcd07ba6c637fa0a2713b461fa750c5d))
* add DOM lib to tsconfig for fetch/Response types in CI ([9d9862a](https://github.com/taiatiniyara/mycash-js/commit/9d9862abaf301c40da84002f2f3a91f08704a7cf))


### Features

* implement mycash-js SDK ([ca98a10](https://github.com/taiatiniyara/mycash-js/commit/ca98a10946eb8b52e1e724dda325117879171e94)), closes [Hi#level](https://github.com/Hi/issues/level) [#1](https://github.com/taiatiniyara/mycash-js/issues/1) [#2](https://github.com/taiatiniyara/mycash-js/issues/2) [#3](https://github.com/taiatiniyara/mycash-js/issues/3) [#4](https://github.com/taiatiniyara/mycash-js/issues/4) [#5](https://github.com/taiatiniyara/mycash-js/issues/5) [#6](https://github.com/taiatiniyara/mycash-js/issues/6) [#7](https://github.com/taiatiniyara/mycash-js/issues/7) [#8](https://github.com/taiatiniyara/mycash-js/issues/8)
