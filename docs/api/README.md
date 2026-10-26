# MaplatCore API reference

This directory holds the **release-dependent API signatures** for `@maplat/core`.

ADR-0012 splits Maplat documentation into two layers:

- **Release-dependent signatures** (method names, parameters, return types) —
  this `docs/api/` directory. Updated on each release.
- **Release-independent conceptual guide** (usage patterns, design notes) —
  the [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference).

Signatures are intentionally not duplicated on the Wiki; the Wiki links back
here for the canonical list.

## Files

- [`maplat-core.md`](maplat-core.md) — `MaplatApp` class signatures
  (map state, coordinates, markers, lines/vectors, POI layers, GPS, events)
- [`maplat-app.md`](maplat-app.md) — `<maplat-app>` Custom Element
  (`@maplat/core/element`: attributes and properties, state, delegated and
  element-specific methods, events, `uiHooks`), the shared base
  `@maplat/core/common` and the conformance tests `@maplat/core/conformance`,
  and the relationship to the `MaplatApp` class (which closes in the next
  major version (2.0))

## Relationship to README

The README's Quick Start section points here for signatures and to the Wiki
for the conceptual guide. See [../../README.md](../../README.md) for installation
and minimal usage.
