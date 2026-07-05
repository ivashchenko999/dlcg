# Changelog

## [1.0.3](https://github.com/ivashchenko999/dlcg/compare/v1.0.2...v1.0.3) (2026-07-05)


### Bug Fixes

* **frontend:** stop discarding HTTP error details in error handlers ([9bde22c](https://github.com/ivashchenko999/dlcg/commit/9bde22c2aad6eec8faf418ddf4dcefaa90e67725))


### Performance Improvements

* **frontend:** enable OnPush change detection in all components ([4ab15e2](https://github.com/ivashchenko999/dlcg/commit/4ab15e2a99639d89e4416d40e65a7386073c6e6c))

## [1.0.2](https://github.com/ivashchenko999/dlcg/compare/v1.0.1...v1.0.2) (2026-07-04)


### Bug Fixes

* harden cache and deployment checks ([12bc58d](https://github.com/ivashchenko999/dlcg/commit/12bc58d9d2ce5c829e30e6172755d187ad56c5b9))

## [1.0.1](https://github.com/ivashchenko999/dlcg/compare/v1.0.0...v1.0.1) (2026-07-04)


### Bug Fixes

* polish validation and local setup ([751ebfb](https://github.com/ivashchenko999/dlcg/commit/751ebfb452405f08abe28825df586bf2da080f9a))

## 1.0.0 (2026-07-04)


### Features

* add bounded catalogue response caching ([293b640](https://github.com/ivashchenko999/dlcg/commit/293b6403275a0a70886cdd4e745050c641554226))
* bound catalogue query string parameters ([a89be16](https://github.com/ivashchenko999/dlcg/commit/a89be166165c3967fe8841a80e7e5c774dd671f5))
* collapse long page lists with ellipses ([562b5af](https://github.com/ivashchenko999/dlcg/commit/562b5afb0ef78e7f0aa660f1a8119ae35c344dc6))
* expose Swagger UI in production for easier review ([e9ff0fa](https://github.com/ivashchenko999/dlcg/commit/e9ff0fa5b0e19684e3e9a8644641f312833006d1))
* grow the sample catalogue to one hundred games ([02cafb3](https://github.com/ivashchenko999/dlcg/commit/02cafb364d785009d1c7419ed36c4928108c6666))
* highlight the active sort column ([c2b43d4](https://github.com/ivashchenko999/dlcg/commit/c2b43d41fd044b53221ffcef13655e717ac5eaa7))
* improve catalogue navigation and data handling ([ef714a4](https://github.com/ivashchenko999/dlcg/commit/ef714a493c539de7ca64fb2a1f4ae70188a58b0f))
* seed a two-page sample catalogue ([d4339aa](https://github.com/ivashchenko999/dlcg/commit/d4339aa6a6216bda8f92cd8ee5770f80acce331b))
* serve Angular build from the API and deploy to Azure via GitHub Actions ([0850d22](https://github.com/ivashchenko999/dlcg/commit/0850d2202bb66edc21ef51d9ba84a0ddda6bd302))


### Bug Fixes

* add release version manifest ([83c733e](https://github.com/ivashchenko999/dlcg/commit/83c733e05644553d1f0636db0fc56498cb95e94f))
* correct middleware order and restrict SPA fallback to non-API routes ([b3a11fc](https://github.com/ivashchenko999/dlcg/commit/b3a11fcf1f1685e31ad2436a44f8e50fc70eee27))
* keep URL state when a search event does not change the text ([f767cd8](https://github.com/ivashchenko999/dlcg/commit/f767cd839e899df524718125a5f99d67663ae117))
* make startup resilient to database outages ([3774e98](https://github.com/ivashchenko999/dlcg/commit/3774e9823d7b501638d86072b701dff533c5e9d2))
* return to the same catalogue page from the edit form ([23a3355](https://github.com/ivashchenko999/dlcg/commit/23a33551e77f1120b9dc0dc4cf4416aa0eeb3955))
* serve frontend assets before SPA fallback ([70c1878](https://github.com/ivashchenko999/dlcg/commit/70c1878e79c405c6fd6908ba49dcf6d48dfb9b41))
* use a neutral load error on the edit form ([a2ca19a](https://github.com/ivashchenko999/dlcg/commit/a2ca19a259a1a7f46292e18b51e728d51e69b357))


### Performance Improvements

* index sortable game columns ([dc5da91](https://github.com/ivashchenko999/dlcg/commit/dc5da9107602368738238f6d663a22a8acbdf8d0))
