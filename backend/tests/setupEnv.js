// Runs before each test file's module graph loads (Jest setupFiles), so
// config/env.js picks these up on first require(). Tests reuse the same
// dev database as docker-compose (globalSetup resets/reseeds it), which is
// fine for a small internal tool with no shared/prod data at this stage.
process.env.NODE_ENV = 'test';
process.env.NOTIFICATIONS_ENABLED = 'false';
