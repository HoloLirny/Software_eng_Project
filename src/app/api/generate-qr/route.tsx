import { v4 as uuidv4 } from "uuid";

interface Token {
  expiresAt: number;
}
let tokens: Record<string, Token> = {};

// Generate a new token
export async function GET(req: Request) {
  const token = uuidv4();
  const expiresAt = Date.now() + 1 * 60 * 1000; // 10 seconds expiration

  tokens[token] = { expiresAt };

  const baseUrl = "http://localhost:3000/attendance";
  const url = `${baseUrl}/${token}`; // for testing

  return new Response(JSON.stringify({ url, token }), {
    headers: { "Content-Type": "application/json" },
  });
}

// Validate token
export async function POST(req: Request) {
  const { token } = await req.json();
  const record = tokens[token];
  const now = Date.now();

  if (record && now < record.expiresAt) {
    return new Response(JSON.stringify({ valid: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(JSON.stringify({ valid: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

//static URL test
// export async function GET(req: Request) {
//   const baseUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Static YouTube link for testing

//   // Append the token to the URL to make it unique every time
//   const token = `youtube-token-${Date.now()}`; // Append timestamp for uniqueness
//   const urlWithToken = `${baseUrl}&token=${token}`; // Modify the URL with the token

//   return new Response(JSON.stringify({ url: urlWithToken, token }), {
//     headers: { "Content-Type": "application/json" },
//   });
// }
