import { createSessionCookie } from "../../../lib/firebase-server";

export async function POST(req: Request) {
    const body = await req.json();
    const { token } = body;

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    const sessionCookie = await createSessionCookie(token, expiresIn);

    return new Response("Session cookie created.", {
        status: 200,
        headers: {
            "Set-Cookie": `session=${sessionCookie}; Path=/; HttpOnly; Secure;`,
            "Content-Type": "application/json",
        },
    });
}