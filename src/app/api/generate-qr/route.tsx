import { v4 as uuidv4 } from "uuid";

interface Token {
  expiresAt: number;
}
let tokens: Record<string, Token> = {};

// Main code
export async function GET(req: Request) {
  const token = uuidv4();
  const expiresAt = Date.now() + 1 * 60 * 1000; // 5 minutes expiration

  tokens[token] = { expiresAt };

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/${token}`;

  return new Response(JSON.stringify({ url, token }), {
    headers: { "Content-Type": "application/json" },
  });
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
