import { NextResponse } from "next/server";
import { verifyThatSessionCookieIsAdmin } from "../../../../server/admin";

export async function POST(req: Request) {
    try {
        console.log("pre req.json()");
        console.log(req);
        const body = await req.json();
        console.log(body)
        const { sessionCookie } = body;
    
        if (!sessionCookie) {
            return NextResponse.json({ error: "Session cookie is missing" }, { status: 400 });
        }
    
        console.log("pre verifyThatSessionCookieIsAdmin");
        const isAdmin = await verifyThatSessionCookieIsAdmin(sessionCookie);
        console.log("post verifyThatSessionCookieIsAdmin", isAdmin);

        if (isAdmin) {
            return NextResponse.json({ isAdmin });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } catch (error) {
        console.error("Error verifying session cookie:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}