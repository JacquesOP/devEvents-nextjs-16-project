# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 16 App Router project. PostHog has been configured using the recommended `instrumentation-client.ts` approach for Next.js 15.3+, with a reverse proxy setup through Next.js rewrites to improve tracking reliability. Custom events have been added to track user engagement with the events listing functionality.

## Integration Summary

The following files were created or modified:

| File | Change Type | Description |
|------|-------------|-------------|
| `.env` | Created | Environment variables for PostHog API key and host |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization with error tracking enabled |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog ingestion |
| `components/ExploreBtn.tsx` | Modified | Added `explore_events_clicked` event tracking |
| `components/EventCard.tsx` | Modified | Added `event_card_clicked` event tracking with event properties |
| `components/Navbar.tsx` | Modified | Added `navigation_link_clicked` event tracking |

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `explore_events_clicked` | User clicked the 'Explore Events' button to scroll to events section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details | `components/EventCard.tsx` |
| `navigation_link_clicked` | User clicked a navigation link in the navbar | `components/Navbar.tsx` |

## Event Properties

### `explore_events_clicked`
- `button_location`: Location of the button (e.g., "hero_section")

### `event_card_clicked`
- `event_title`: Title of the clicked event
- `event_slug`: URL slug of the event
- `event_location`: Location of the event
- `event_date`: Date of the event

### `navigation_link_clicked`
- `link_name`: Name of the clicked link (e.g., "Home", "Events", "Create Event")
- `link_href`: URL of the link
- `navigation_location`: Location of the navigation (e.g., "header")

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/120434/dashboard/503499)

### Insights
- [Event Card Clicks Over Time](https://eu.posthog.com/project/120434/insights/UAfMAegD) - Track how users interact with event cards over time
- [Explore Events Button Clicks](https://eu.posthog.com/project/120434/insights/Q1rebXcO) - Track clicks on the Explore Events CTA button
- [Navigation Link Clicks](https://eu.posthog.com/project/120434/insights/nVdN0SNg) - Track navigation link usage in the header (broken down by link name)
- [Explore to Event Card Funnel](https://eu.posthog.com/project/120434/insights/DjbFajsq) - Conversion funnel from clicking Explore Events to clicking an event card
- [Top Events by Clicks](https://eu.posthog.com/project/120434/insights/huZEYMPX) - Which events receive the most interest from users

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
