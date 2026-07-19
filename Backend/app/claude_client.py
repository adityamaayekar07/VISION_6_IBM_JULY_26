"""
Thin wrapper around the Anthropic SDK.
The API key is read ONLY from the server-side environment — it is never
sent to, or accepted from, the frontend/client.
"""

import os
from anthropic import Anthropic, AsyncAnthropic

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not ANTHROPIC_API_KEY:
    # Fail loudly at startup rather than silently 500-ing on first request.
    raise RuntimeError(
        "ANTHROPIC_API_KEY is not set. Add it to your .env file or "
        "environment variables (never commit it to version control)."
    )

MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6")

# Async client, used for streaming responses
async_client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
