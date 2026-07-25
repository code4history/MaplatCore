# consumption (delta)

## ADDED Requirements

### Requirement: Map Primitive Exports
The package entry point SHALL export `MaplatMap` and `mapSourceFactory` as named exports, in both ESM and UMD bundles.

#### Scenario: Instantiating MaplatMap from the entry point
- Given a consumer imports `{ MaplatMap }` from `@maplat/core`
- When it constructs a map with a custom projection setup
- Then no deep import into `src/` internals is required

#### Scenario: Creating sources via mapSourceFactory
- Given a consumer imports `{ mapSourceFactory }` from `@maplat/core`
- When it calls the factory with map options
- Then it receives the same source instances `MaplatApp` uses internally
