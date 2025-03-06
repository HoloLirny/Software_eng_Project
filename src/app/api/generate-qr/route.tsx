import { v4 as uuidv4 } from "uuid";
interface Token {
  expiresAt: number;
  used: boolean; // Flag for single-scan mode
  mode: "time" | "single-scan"; // QR mode
  user_email: string,
  courseId: string;
}

let tokens: Record<string, Token> = {};

// Generate a new token
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "time"; // Default to time-based mode
  const courseId = searchParams.get("courseId") || "";
  const user_email = searchParams.get("email") || "";
	
  const token = uuidv4();
  const expireTime = Number(searchParams.get("expireTime")) || 10; // Default to 10 seconds if null
  const expiresAt = Date.now() + expireTime * 1000; // 10 seconds expiration

  tokens[token] = {
    expiresAt,
    used: false,
    mode: mode as "time" | "single-scan", // "time" or "single-scan"
    courseId,
    user_email,
  };

  const baseUrl = `${process.env.NEXTAUTH_URL}/attendance`;
  const url = `${baseUrl}/${token}`; // For testing

  return new Response(JSON.stringify({ url, token }), {
    headers: { "Content-Type": "application/json" },
  });
}

// Validate token
export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const record = tokens[token];
    const now = Date.now();
    console.log("test token in api ",token)
    if (!record) {
      return new Response(
        JSON.stringify({ valid: false, message: "Invalid Token" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (record.mode === "time") {
      // Time-based expiration
      if (now < record.expiresAt) {
        return new Response(
          JSON.stringify({
            valid: true,
            message: "Valid Token",
            courseId: record.courseId, // ✅ Include courseId in the response
            user_email: record.user_email,
            mode: record.mode,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ valid: false, message: "Token Expired" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }  else if (record.mode === "single-scan") {
      // Single-scan mode
      if (record.used) {
        return new Response(
          JSON.stringify({
            valid: false,
            message: "Token has already been used. Please scan a new QR code.",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        record.used = true; // Mark as used

        return new Response(
          JSON.stringify({
            valid: true,
            message: "Token Valid",
            courseId: record.courseId, // ✅ Include courseId in the response
            user_email: record.user_email,
            mode: record.mode,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ valid: false, message: "Unknown Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, message: "Invalid Request Data" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
