# Security Specification

## Data Invariants
- An `Account` belongs to a specific user (`ownerId == request.auth.uid`).
- A `JournalEntry` belongs to a specific user (`ownerId == request.auth.uid`).
- `JournalEntry` items must be an array of bounded size (max 100).
- Timestamps must correspond to the server time during creation.
- Owner ID cannot be changed.

## The "Dirty Dozen" Payloads
1. Create Account with omitted `ownerId`.
2. Create Account with spoofed `ownerId`.
3. Create Account with `balance` as a string instead of number.
4. Update Account `ownerId` to someone else.
5. Create JournalEntry with `items` array over 100 elements.
6. Create JournalEntry with mismatched `ownerId`.
7. Update JournalEntry `ownerId`.
8. Create JournalEntry with missing `date`.
9. Create Account with unknown `type`.
10. Update JournalEntry adding a boolean `isVerified` ghost field.
11. Update Account adding a `status` ghost field.
12. Read Account belonging to a different user.

## Test Runner
(We will write `firestore.rules.test.ts` to assert these)
