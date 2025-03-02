import { NextResponse } from "next/server";
import { verifyThatSessionCookieIsAdmin } from "../../../../server/admin";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionCookie } = body;
    
        if (!sessionCookie) {
            return NextResponse.json({ error: "Session cookie is missing" }, { status: 400 });
        }
    
        const isAdmin = await verifyThatSessionCookieIsAdmin(sessionCookie);

        if (isAdmin) {
            return NextResponse.json({ isAdmin });
        } else {
            return NextResponse.json({ error: "Unauthorized",
            }, { status: 401 });
        }
    } catch (error) {
        console.error("Error verifying session cookie:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}