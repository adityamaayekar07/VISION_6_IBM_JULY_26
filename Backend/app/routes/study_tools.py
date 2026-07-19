import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.claude_client import async_client, MODEL
from app.models import (
    SummarizeRequest,
    ExplainRequest,
    MCQRequest,
    QuizRequest,
    InterviewRequest,
)

router = APIRouter()


async def _stream_completion(system: str, user_content: str):
    """Shared SSE streaming helper for all one-shot study tool prompts."""
    try:
        async with async_client.messages.stream(
            model=MODEL,
            max_tokens=2048,
            system=system,
            messages=[{"role": "user", "content": user_content}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps({'type': 'delta', 'text': text})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"


def _sse_response(system: str, user_content: str):
    return StreamingResponse(
        _stream_completion(system, user_content),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/summarize")
async def summarize_notes(payload: SummarizeRequest):
    """POST /api/study/summarize — Notes Summarizer tool."""
    system = (
        "You are a study assistant. Summarize the student's notes clearly. "
        f"Output style: {payload.style}. Keep key terms and definitions intact."
    )
    return _sse_response(system, payload.notes)


@router.post("/explain")
async def explain_topic(payload: ExplainRequest):
    """POST /api/study/explain — Topic Explanation tool."""
    system = (
        "You are a patient tutor. Explain topics clearly with examples, "
        f"pitched at a {payload.depth} level."
    )
    return _sse_response(system, f"Explain this topic: {payload.topic}")


@router.post("/mcq")
async def generate_mcq(payload: MCQRequest):
    """POST /api/study/mcq — MCQ Generator tool. Returns streamed JSON text."""
    system = (
        "You are an exam question generator. Generate multiple-choice questions "
        "and return ONLY valid JSON (no markdown fences, no commentary) as an "
        "array of objects with fields: question, options (array of 4 strings), "
        "correct_index (0-3), explanation."
    )
    user_content = (
        f"Generate {payload.count} {payload.difficulty}-difficulty MCQs "
        f"on the topic: {payload.topic}"
    )
    return _sse_response(system, user_content)


@router.post("/quiz")
async def generate_quiz(payload: QuizRequest):
    """POST /api/study/quiz — Quiz Generator tool."""
    system = (
        "You are an exam question generator. Generate a quiz and return ONLY "
        "valid JSON (no markdown fences) as an array of objects with fields: "
        "question, type, options (if applicable), correct_answer, explanation."
    )
    user_content = (
        f"Generate a {payload.quiz_type} quiz with {payload.question_count} "
        f"questions on the topic: {payload.topic}"
    )
    return _sse_response(system, user_content)


@router.post("/interview")
async def interview_prep(payload: InterviewRequest):
    """POST /api/study/interview — Interview Preparation tool."""
    system = (
        "You are a friendly technical/behavioral interview coach running a "
        "mock interview. Ask one question at a time, then give brief, "
        "constructive feedback on the previous answer if one is provided."
    )
    if payload.previous_answer:
        user_content = (
            f"Role: {payload.role} ({payload.experience_level} level).\n"
            f"My previous answer: {payload.previous_answer}\n"
            "Give brief feedback, then ask the next interview question."
        )
    else:
        user_content = (
            f"Role: {payload.role} ({payload.experience_level} level).\n"
            "Start the mock interview with the first question."
        )
    return _sse_response(system, user_content)
