---
trigger: always_on
---
1.Database interactions must always use the drizzle schema and queries
2.All auth is handled by clerk. it's important that users can only access their own data, and not be able to access any data that does not belong to them.
3.Data retrieval must always be done via server components. any updates / deletes / inserts into our database must always be done via server actions. data validation must always be done using zod. any data passed to server actions must be validated by zod and must have a typescript type (DO NOT use FormData as the type).
