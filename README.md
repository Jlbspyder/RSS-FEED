# Frontpage

Frontpage is a customizable content aggregator that pulls RSS and Atom feeds into one well-designed reading dashboard. It is a full-stack RSS feed reader designed to provide a clean, distraction-free way to consume content from multiple sources in one place. The application allows users to follow feeds, organize them, and efficiently catch up on new content through a structured reading experience.

**Live URL:** [https://jlb-rssfeed.netlify.app]


## Overview

The goal of the project is to simplify how users interact with RSS feeds by combining:

-   a minimal, calm reading interface
-   a structured backend for managing feeds and users
-   a fast, responsive frontend experience

It eliminates the noise typically found in modern content platforms and focuses on readability and control.

## Core Features

User Authentication
-   Secure signup and login using JWT
-   Persistent sessions with /me endpoint

Guest Mode
-   Users can explore the product without creating an   account
-   Preloaded feeds simulate a real user experience

Feed Aggregation
-   Fetches and parses RSS/Atom feeds from multiple sources
-   Displays articles in a unified format

Dashboard Experience
-   Centralized view of all feeds
-   Organized reading with read/unread states

Responsive Reader
-   Clean article cards
-   Optimized for both desktop and mobile consumption


### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React |
| Backend | Express |
| Database | Neon |
| ORM | Prisma |
| Authentication | JWT |
| Styling | TailwindCSS & Custom CSS |


## AI Collaboration

This project was built with the support of AI tools to accelerate development, improve code quality, and unblock complex issues during implementation. AI was used as a collaborative engineering assistant, not a replacement for understanding. Every output was reviewed, tested, and adapted to fit the architecture of the application.

AI was heavily used to:

-   trace inconsistent backend behavior
-   diagnose “ghost server” issues (wrong backend instance running)
-   debug Prisma migration errors
-   identify missing fields in API responses
-   analyze network requests and responses step-by-step

This significantly reduced debugging time and improved reliability.
