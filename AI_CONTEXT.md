# Yoombal-s – Technical Context

## Current State
- Supabase local is running
- Database was restored from an old Supabase backup (>90 days)
- This local database is the source of truth

## Supabase
- Local Supabase only
- Schema is defined in `supabase/migrations/000_current_schema.sql`
- Auth, public schemas are active

## Important Rules
- DO NOT recreate the database
- DO NOT reset Supabase
- DO NOT generate new migrations unless explicitly requested
- Always respect existing tables and relations

## Goal
Continue development based on the current database schema and GitHub codebase

---

PROMPT TO GIVE TO LOVABLE AGENT (copy-paste EXACTLY):

You are working on the GitHub repository "Yoombal-s".

IMPORTANT CONTEXT:
- The Supabase database has already been restored locally from an old backup.
- The local Supabase database is the source of truth.
- The current database schema is frozen and documented in:
  supabase/migrations/000_current_schema.sql
- Read AI_CONTEXT.md carefully before making any change.

STRICT RULES:
- Do NOT reset Supabase
- Do NOT recreate tables
- Do NOT generate new migrations unless explicitly asked
- Respect existing auth and public schemas

GOAL:
Continue development using the existing GitHub codebase and the current Supabase schema.
Propose changes incrementally and safely.
