# viewpoint (delta)

## ADDED Requirements

### Requirement: Degree-based Rotation Getter
`MaplatApp` SHALL provide `getRotation()` returning the current map rotation in degrees, normalized to the same range `changeViewpoint` events use.

#### Scenario: Reading rotation without touching internals
- Given a running `MaplatApp` whose view rotation is π/2 radians
- When a consumer calls `app.getRotation()`
- Then it receives `90` (degrees), with no manual radian conversion or `mapObject` access

### Requirement: Degree-based Direction Getter
`MaplatApp` SHALL provide `getDirection()` resolving to the current real-world bearing in degrees, computed with the same viewpoint math as the `changeViewpoint` event's `direction` field.

#### Scenario: Reading direction on a historical map
- Given a running `MaplatApp` displaying a TIN-warped historical map
- When a consumer awaits `app.getDirection()`
- Then it resolves to the normalized degree bearing matching the `direction` payload of the next `changeViewpoint` event at the same view state
