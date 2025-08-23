# DB schema v1 (MVP)

Entities

- users (id, created_at)
- profiles (user_id, display_name, avatar_url)
- stories (id, title, description, cover, genres[], age_rating, premium_model, version)
- chapters (id, story_id, idx, title, premium, assets[])
- saves (user_id, story_id, chapter_id, node_id, variables jsonb, updated_at)
- bookmarks (user_id, story_id, chapter_id, created_at)
- purchases (user_id, product_id, provider, transaction_id, entitlement, created_at)

Notes

- Content nodes are primarily stored in JSON packs in object storage; DB stores metadata and indexing for discovery.
- Add indexes on (user_id, story_id), (story_id, idx).
