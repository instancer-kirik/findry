# Architecture rules

- Keep inventory edits as row-local drafts with explicit saves to `space_tools`; this prevents incomplete cell edits from being persisted.