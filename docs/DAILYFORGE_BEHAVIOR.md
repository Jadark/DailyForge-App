# DailyForge — Core Behavior Specification

## Daily Goal Lifecycle
- Each day has exactly one active goal
- Goal is associated with the local calendar day
- Goal persists until completed or day rollover

## Completion Rules
- A goal can be completed once per day
- Completion triggers:
  - Visual confirmation
  - Optional animation
  - Passive streak increment

## Day Rollover
- At local midnight:
  - Previous goal is archived
  - New day starts with no goal set
- Rollover occurs automatically on app open

## EOL (Ease-of-Life / End-of-Life) Signals
- Clear indication when the day is "done"
- No additional actions required after completion
- UI should encourage closing the app once complete

## Error Handling
- If storage fails, goal state resets safely
- App must never block goal entry due to errors
