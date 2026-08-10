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

## Relationship to README

The README's Quick Start section points here for signatures and to the Wiki
for the conceptual guide. See [../../README.md](../../README.md) for installation
and minimal usage.
