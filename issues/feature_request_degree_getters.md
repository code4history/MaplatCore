# Feature Request: Implement `getRotation` and `getDirection` returning Degrees

## Context
Currently, `MaplatApp` accepts `restore.position.rotation` and `direction` in **Degrees**.
However, when retrieving the current map state, `MaplatApp` does not provide native methods. Consumers (like MaplatUI) must access the internal OpenLayers View directly:
```javascript
app.mapObject.getView().getRotation() // Returns Radians
```
And then manually convert this to Degrees. This creates an inconsistency between Input (Degree) and Output (Radian from internal object).

## Proposal
Implement the following methods on `MaplatApp` class to provide a consistent interface:

### 1. `getRotation(): number`
- **Returns**: Current rotation in **Degrees**.
- **Behavior**: Wraps `this.mapObject.getView().getRotation()`, converts from Radian to Degree, and normalizes the value.

### 2. `getDirection(): number`
- **Returns**: Current direction in **Degrees**.
- **Behavior**: Calculates the direction based on the current map state (taking North-Up settings etc. into account if necessary, matching the logic used in `setViewpoint`), converts to Degree, and returns it.

## Benefit
- **Consistency**: Unified unit (Degree) for both Input (`restore`) and Output.
- **Simplification**: External modules (UI) no longer need to perform `rad * 180 / Math.PI` conversions repeatedly.
- **Encapsulation**: Reduces reliance on direct `mapObject` access.

## Target Version
Next Minor/Major release (e.g. v0.11.x or v1.0)
