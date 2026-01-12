# Job Management Dashboard

A full-stack web application for managing computational jobs with real-time status tracking, built with Django (backend), React + Chakra UI (frontend), and PostgreSQL (database).

## 🚀 Quick Start

To run the backend: 
docker compose up -d --build
docker compose exec backend python manage.py migrate

To run the frontend: 
cd frontend
npm i
npm run dev

# Problem Approach and though process

I began by analyzing the problem requirements to clarify the expected functionality, data flow, and API behavior. I used AI as a scaffolding tool to help generate an initial project structure and outline, particularly for setting up Django and establishing baseline API patterns, as this was my first time working with the framework. I defined the required inputs, query parameters, and response shapes, and used AI guidance to accelerate initial setup and syntax familiarity.

From the outset, I designed with performance in mind, ensuring queries were executed at the database level, avoiding unnecessary nesting or in-memory processing, and keeping query logic simple, predictable, and efficient.

While reviewing the requirements, I identified several design and implementation considerations that required clarification or explicit assumptions:

- State transition constraints: Whether job status changes were expected to follow a defined state machine (e.g., enforcing valid transitions such as pending → completed while preventing invalid transitions).

- Deletion strategy: Whether records should be hard-deleted from the database or soft-deleted to preserve historical data and auditability.

- API response design: Determining the minimal response payloads required for each endpoint, avoiding the return of unnecessary fields to reduce payload size and improve performance.

- Authorization boundaries: In the absence of an authentication layer, deletion and mutation endpoints are inherently permissive. To mitigate this, I implemented defensive validations at the API level to prevent invalid or unexpected state mutations, including guarding against malformed or unauthorized status values from concurrent or external requests.

Since these considerations were not explicitly defined in the instructions, I made reasonable assumptions and opted for a simplified implementation. However, these are the types of questions I would typically surface during team discussions to align on requirements and long-term maintainability.

After defining the required API endpoints, I reviewed and validated them using Postman, iterating on request/response behavior through manual testing. Once the backend APIs were stable, I used AI to assist with scaffolding the frontend structure. I defined TypeScript types, integrated the API layer, and selected Chakra UI to accelerate component development, leveraging its built-in accessibility features and familiarity to maintain development velocity. After establishing a solid baseline, I iteratively added additional features and refinements.

Extra Features
- Server Side Pagination
- Server Side Sorting
- Server Side Filtering
- Confirmation Modal when deleting

Once the core functionality was stable, I used AI to assist with scaffolding the Playwright test setup. Having prior experience with Playwright and its best practices, I ensured the test suite was structured with reusable helper utilities to reduce duplication and improve maintainability. I validated the tests through repeated execution to confirm they were stable, non-flaky, and asserting meaningful user and API behaviors rather than incidental implementation details.

Given additional time, I would make the following improvements:

- Introduce a centralized frontend theming system to standardize typography, color palettes, and spacing, improving visual consistency and long-term maintainability.

- Refine the user experience by improving layout clarity, interaction feedback, and overall usability, potentially incorporating design system guidelines to inform UI decisions.

- Add a linter and enforce consistent code quality standards across the codebase, integrating it into the development workflow to catch errors early and maintain stylistic consistency.

The project was completed in approximately 3–4 hours, with 1–2 hours dedicated to implementing core functionality and API endpoints, and an additional 1–2 hours allocated to performance considerations, test coverage, documentation, and incremental refinements.