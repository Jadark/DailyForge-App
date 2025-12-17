# DailyForge — Streaks & Stats Specification

## Streak Definition
- A streak is the count of consecutive days with completed goals
- Missing a day resets the streak to zero

## Increment Rules
- Streak increments only once per calendar day
- Completion must occur before local midnight

## Reset Rules
- If a day passes without completion:
  - Streak resets
  - Historical stats remain intact

## Stats Tracked
- Total days completed
- Longest streak
- Current streak
- Completion rate (derived)

## Edge Cases
- Changing system time may cause reset
- First launch initializes streak at zero
- Stats are passive and cannot be edited by the user

## Source of Truth
These rules mirror the SwiftUI DailyForge v1 implementation and must remain consistent across platforms.
