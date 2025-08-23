# Analytics taxonomy (MVP)

A living reference for events and properties. Owners: Product + Data.

## Core events

- app_start { build, os, locale }
- app_foreground { session_id }
- story_view { story_id }
- story_start { story_id }
- chapter_start { story_id, chapter_index }
- choice_presented { story_id, chapter_index, node_id, options_count }
- choice_selected { story_id, chapter_index, node_id, choice_index, choice_id }
- chapter_complete { story_id, chapter_index }
- story_complete { story_id }
- paywall_view { placement }
- purchase_attempt { product_id, price, currency }
- purchase_success { product_id, price, currency }
- purchase_failure { product_id, error_code }
- download_start { story_id, size }
- download_success { story_id, size, duration_ms }
- download_failure { story_id, error_code }
- offline_read_start { story_id, chapter_index }

## Notes

- Use consistent snake_case keys.
- Include app/user/device context at the SDK level (do not duplicate per event).
- Version events with "event_version" property when structure changes.
