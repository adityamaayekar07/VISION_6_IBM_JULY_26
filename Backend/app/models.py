from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., description="Conversation history")
    system: Optional[str] = Field(
        default="You are Vision 6 AI, a helpful, encouraging exam-preparation "
        "assistant. Explain concepts clearly and check the student's "
        "understanding as you go.",
    )


class SummarizeRequest(BaseModel):
    notes: str = Field(..., min_length=1, description="Raw notes / text to summarize")
    style: Literal["concise", "detailed", "bullet-points"] = "bullet-points"


class ExplainRequest(BaseModel):
    topic: str
    depth: Literal["beginner", "intermediate", "advanced"] = "beginner"


class MCQRequest(BaseModel):
    topic: str
    count: int = Field(default=5, ge=1, le=20)
    difficulty: Literal["easy", "medium", "hard"] = "medium"


class QuizRequest(BaseModel):
    topic: str
    question_count: int = Field(default=10, ge=1, le=25)
    quiz_type: Literal["mixed", "mcq", "short-answer", "true-false"] = "mixed"


class InterviewRequest(BaseModel):
    role: str = Field(..., description="Job role / subject area to prep for")
    experience_level: Literal["entry", "mid", "senior"] = "entry"
    previous_answer: Optional[str] = Field(
        default=None, description="Student's answer to the previous question, if any"
    )
