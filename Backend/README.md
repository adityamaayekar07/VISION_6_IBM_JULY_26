# Vision 6 AI — Backend

FastAPI backend for the Vision 6 AI exam-prep assistant. Proxies requests to
Anthropic's Claude API, streams responses back to the frontend over SSE, and
keeps the API key server-side only.

## Endpoints

| Method | Path                    | Frontend feature        |
|--------|--------------------------|--------------------------|
| POST   | `/api/chat/stream`       | AI Chat Interface        |
| POST   | `/api/study/explain`     | Topic Explanation        |
| POST   | `/api/study/summarize`   | Notes Summarizer         |
| POST   | `/api/study/mcq`         | MCQ Generator             |
| POST   | `/api/study/quiz`        | Quiz Generator             |
| POST   | `/api/study/interview`   | Interview Preparation    |
| GET    | `/health`                | Health check (load balancer) |

All AI endpoints stream `text/event-stream` responses, one `data: {...}\n\n`
event per token/chunk, plus a final `{"type": "done"}` event. Example frontend
consumption:

```js
const res = await fetch("http://localhost:8000/api/chat/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: userInput }] }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });

  const events = buffer.split("\n\n");
  buffer = events.pop(); // keep incomplete chunk
  for (const evt of events) {
    if (!evt.startsWith("data: ")) continue;
    const data = JSON.parse(evt.slice(6));
    if (data.type === "delta") appendToChatBubble(data.text);
    if (data.type === "error") showError(data.message);
  }
}
```

## Local setup

```bash
cd vision6-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and paste your real ANTHROPIC_API_KEY

uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/health` to confirm it's running.

## Docker

```bash
docker build -t vision6-backend .
docker run -p 8000:8000 --env-file .env vision6-backend
```

Never bake `.env` into the image — it's excluded via `.dockerignore` and keys
are injected at container runtime.

## Deploying to AWS App Runner (simplest path)

1. Push this backend to its own GitHub repo (or a subfolder) — **do not commit `.env`**.
2. In the AWS Console, open **App Runner → Create service**.
3. Source: connect your GitHub repo, or push the built image to **Amazon ECR**
   and point App Runner at the ECR image.
4. Build settings: App Runner can build directly from the `Dockerfile`, or use
   the image you pushed to ECR.
5. Under **Configure service → Environment variables**, add:
   - `ANTHROPIC_API_KEY` = your real key
   - `CLAUDE_MODEL` = `claude-sonnet-4-6`
   - `ALLOWED_ORIGINS` = your deployed frontend's HTTPS URL
6. Port: `8000` (matches `EXPOSE 8000` / the `PORT` env var).
7. Deploy. App Runner gives you a public HTTPS URL automatically (e.g.
   `https://xxxx.us-east-1.awsapprunner.com`) — no manual TLS/cert setup needed.
8. Point your frontend's `fetch()` base URL at that App Runner URL.

### Pushing to ECR manually (if not using App Runner's GitHub auto-build)

```bash
aws ecr create-repository --repository-name vision6-backend
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account_id>.dkr.ecr.<region>.amazonaws.com

docker build -t vision6-backend .
docker tag vision6-backend:latest <account_id>.dkr.ecr.<region>.amazonaws.com/vision6-backend:latest
docker push <account_id>.dkr.ecr.<region>.amazonaws.com/vision6-backend:latest
```

Then create the App Runner service pointing at that ECR image URI.

## Security notes

- The API key is read only from `os.getenv("ANTHROPIC_API_KEY")` in
  `app/claude_client.py`. It is never sent to or read from the frontend.
- `.env` is git-ignored and docker-ignored — only `.env.example` (no real
  values) is committed.
- `ALLOWED_ORIGINS` restricts CORS to your actual frontend domain(s); update
  it before going to production (don't leave it wide open with `*`).
- Set real environment variables in App Runner/Elastic Beanstalk's
  configuration UI (or via AWS Secrets Manager) — not in the Dockerfile.
