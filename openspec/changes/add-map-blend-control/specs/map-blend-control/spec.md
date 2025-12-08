## ADDED Requirements
### Requirement: Blend Ratio API
MaplatApp MUST expose `setBlendRatio(number)` and `getBlendRatio()` to control the mix between the warped historical layer (1.0) and the live basemap (0.0). The API MUST clamp values to 0-1 and emit a `blendchange` event with the normalized ratio whenever the value changes.

#### Scenario: Programmatic blend update
- **GIVEN** a Maplat app showing a warped map
- **WHEN** a client calls `setBlendRatio(0.4)`
- **THEN** the internal blend state is stored as `0.4` and a `blendchange` event fires exactly once with `{ ratio: 0.4 }`.

### Requirement: Blend Controller Input
The SDK MUST provide an optional `MapBlendController` helper that wires pointer, touch, and keyboard input into the blend API without shipping a heavyweight UI skin. The helper MUST expose CSS hooks so integrators can skin the slider.

#### Scenario: Pointer drag updates blend
- **GIVEN** a controller bound to an element with width 200px
- **WHEN** the user drags from 20px to 180px
- **THEN** the controller calls `setBlendRatio(0.8)` and updates its visual handle to 180px.

### Requirement: Persisted Blend State
Serialized map state (share links, saved sessions) MUST include the latest blend ratio so collaborators see the same comparison view when reopening.

#### Scenario: Restore blend ratio from state
- **GIVEN** saved state that contains `blendRatio: 0.65`
- **WHEN** MaplatApp restores the session
- **THEN** it calls `setBlendRatio(0.65)` before rendering and emits a `blendchange` event so UI controllers sync.
