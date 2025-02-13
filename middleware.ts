import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

 
export async function middleware(req: NextRequest) {
console.log(req)
    if (req.nextUrl.pathname.startsWith("/bo")) {
        const pathChunks = req.nextUrl.pathname
            .split("/")
            .filter(c => c !== "");

        if (!(pathChunks.length >= 2 && pathChunks[1] === "login")) {

            const sessionCookie = req.cookies.get("session");
console.log("sessionCookie", sessionCookie);

            if (sessionCookie) {

                const result = await fetch(req.nextUrl.origin + "/api/session/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sessionCookie: sessionCookie.value }),
                })

                console.log(5)
console.log(result);
console.log(await readBody(result.body!))


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
console.log("out");
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = "/bo/login";
            redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }
console.log(66)
    const maintenance = process.env.MAINTENANCE === 'true';
    if (maintenance) {
        const rewriteUrl = req.nextUrl.clone();
        rewriteUrl.pathname = '/maintenance';
        return NextResponse.rewrite(rewriteUrl);
    }
console.log(100)
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|img|fonts|videos|api|redirect|favicon.ico).*)'
    ],
}

async function readBody(stream: ReadableStream) {
    const reader = stream.getReader();
    let result = '';
  
    try {
      while (true) {
        const { done, value } = await reader.read();
  
        if (done) {
          break; // Stream is finished
        }
  
        // Assuming the stream contains text data encoded as UTF-8
        const chunk = new TextDecoder().decode(value);
        result += chunk;
      }
    } finally {
      reader.releaseLock(); // Release the lock when done
    }
  
    return result;
  }