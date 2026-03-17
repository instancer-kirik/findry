# Resend Auth Email Setup — Pending

**Status:** Not yet configured  
**Date:** 2026-03-17  
**Context:** Infrastructure

## Summary
Findry uses **Resend** for authentication emails (password resets, magic links, verification). The `RESEND_API_KEY` secret has **not been added** to the project yet.

## What's Needed
1. Add `RESEND_API_KEY` as a project secret
2. Supabase handles auth flows natively
3. Custom transactional emails would need Edge Functions + Resend

## Action Items
- [ ] User to confirm they want to set up Resend
- [ ] Add the secret via Lovable secrets tool
- [ ] Configure email domain if needed
