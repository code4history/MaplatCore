# UI/Core Lifecycle

## Overview
MaplatCore emits lifecycle phases to make initialization order explicit. Maplat UI and
custom integrations can attach to these phases via `appOption.uiHooks`. Each phase
can be async; Core awaits Promises before moving forward.

## Phase order
1. `lifecycle:setting-loaded`
2. `lifecycle:appdata-ready`
3. `lifecycle:ui-configure`
4. `lifecycle:core-dom-ready`
5. `lifecycle:ui-dom-ready`
6. `lifecycle:core-ready`
7. `lifecycle:ui-ready`

## Context payload
Each lifecycle event delivers a context object:
- `phaseId`
- `appData` (when available)
- `mapDivDocument` (when available)
- `core` (MaplatCore instance)
- `uiHookResults` (accumulated hook return values)
- `uiHookResult` (return value of this phase's hook)

## Hooks
MaplatCore accepts optional hooks via `appOption.uiHooks`:
- `onSettingLoaded`
- `onAppdataReady`
- `onUiConfigure`
- `onCoreDomReady`
- `onUiDomReady`
- `onCoreReady`
- `onUiReady`

Each hook may return a value or a Promise. Returned values are stored in
`uiHookResults` for later phases.

## Error handling
If a hook throws or rejects, Core:
- emits `lifecycle:error` with `{ phaseId, error }`
- stops further phase progression for that instance

## Migration note
Legacy events (`appdata`, `uiPrepare`) are no longer used by the default UI flow.
Custom integrations should migrate to `lifecycle:*` events or `uiHooks`.
