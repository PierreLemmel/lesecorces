import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

 
export async function middleware(req: NextRequest) {

    if (req.nextUrl.pathname.startsWith("/bo")) {
        const pathChunks = req.nextUrl.pathname
            .split("/")
            .filter(c => c !== "");

        if (!(pathChunks.length >= 2 && pathChunks[1] === "login")) {

            const sessionCookie = req.cookies.get("session");

            if (sessionCookie) {

                const result = await fetch(req.nextUrl.origin + "/api/session/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sessionCookie: sessionCookie.value }),
                })

                if (result.status === 200) {
                    const { isAdmin } = await result.json();
                    if (isAdmin) {
                        return NextResponse.next();
                    }
                }
                else {
                    console.log("Failed to authenticate session cookie:", result.status, await result.json());
                }
            }

            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = "/bo/login";
            redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    const maintenance = process.env.MAINTENANCE === 'true';
    if (maintenance) {
        const rewriteUrl = req.nextUrl.clone();
        rewriteUrl.pathname = '/maintenance';
        return NextResponse.rewrite(rewriteUrl);
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|img|fonts|videos|api|redirect|favicon.ico).*)'
    ],
}