// Vercel function: POST /api/submit saves a "Submit a place" report to Google Sheets with status Pending.
// Setup (Sheet, service account, environment variables) is in README.md under "Submissions".
import { handleSubmit, createLimiter } from './_lib/handler.js';

const limiter = createLimiter(5, 10 * 60_000);

export async function POST(request: Request): Promise<Response> {
  return handleSubmit(request, {
    env: process.env,
    fetch,
    now: Date.now,
    uuid: () => crypto.randomUUID(),
    limiter,
    log: message => console.error(message),
  });
}
