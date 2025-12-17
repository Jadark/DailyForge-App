# DailyForge — Migration Notes (SwiftUI → Expo)

## Migration Intent
- SwiftUI app is the behavioral reference
- Expo app is the new production target

## Non-Goals
- Widgets are paused
- No new features during migration
- No behavior changes

## Data Considerations
- Local storage format may change
- Early users may experience a data reset
- This is acceptable at current scale

## Platform Strategy
- Expo is primary for iOS, Android, and Web
- Native iOS work is reserved for future widgets only

## Stability Rule
During migration:
- Match behavior before optimizing UX
- Preserve streak and stats semantics exactly
