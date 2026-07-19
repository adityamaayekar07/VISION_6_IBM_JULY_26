import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.claude_client import async_client, MODEL
from app.models import ChatRequest

router = APIRouter()


async def sse_stream(messages, system):
    """
    Yields Server-Sent Events so the frontend can render tokens progressively,
    matching the 'Streaming response animation' / 'typing indicator' UI already
    built in js/chat.js.
    """
    try:
        async with async_client.messages.stream(
            model=MODEL,
            max_tokens=1024,
            system=system,
            messages=[{"role": m.role, "content": m.content} for m in messages],
        ) as stream:
            async for text in stream.text_stream:
                payload = json.dumps({"type": "delta", "text": text})
                yield f"data: {payload}\n\n"

            final_message = await stream.get_final_message()
            done_payload = json.dumps(
                {"type": "done", "stop_reason": final_message.stop_reason}
            )
            yield f"data: {done_payload}\n\n"

    except Exception as e:
        error_payload = json.dumps({"type": "error", "message": str(e)})
        yield f"data: {error_payload}\n\n"


@router.post("/stream")
async def stream_chat(payload: ChatRequest):
    """
    POST /api/chat/stream
    Body: { "messages": [{"role": "user", "content": "..."}], "system": "..." }

    Returns text/event-stream. Frontend should consume with EventSource-style
    parsing (e.g. via fetch + ReadableStream, since EventSource only supports GET).
    """
    return StreamingResponse(
        sse_stream(payload.messages, payload.system),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # disable proxy buffering (nginx/App Runner)
        },
    )
