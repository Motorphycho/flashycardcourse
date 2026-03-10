---
trigger: always_on
---
1.Database interactions must always use the drizzle schema and queries
2.All auth is handled by clerk. it's important that users can only access their own data, and not be able to access any data that does not belong to them.
3.Data retrieval must always be done via server components. any updates / deletes / inserts into our database must always be done via server actions. data validation must always be done using zod. any data passed to server actions must be validated by zod and must have a typescript type (DO NOT use FormData as the type).
4.If Windsurf doesn't apply changes via this prompt, try temporarily setting the rule type to "manual" and removing the rule from context. 
5.ONLY shadcn ui components should be used for the UI in this project. ABSOLUTELY NO custom UI should be created in this project. All clerk sign in and sign up buttons should use the shadcn ui buttons, and clerk should use a modal to launch the sign in and sign up functionality.
6.(Add src/page.tsx and src/dashboard/page.tsx as context. You can either do these as separate chats or try adding both in the same prompt)
7.Make sure all the shadcn-ui.mdc rules are being adhered to in this file.