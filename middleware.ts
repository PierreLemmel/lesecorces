import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    
    const maintenance = process.env.MAINTENANCE === 'true';
    if (maintenance) {
		console.log(request.url)

        request.nextUrl.pathname = '/maintenance';
        return NextResponse.rewrite(request.nextUrl);
    }
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - static (static files)
       * - favicon.ico (favicon file)
       */
      '/((?!_next/static|img|fonts|api|redirect|favicon.ico).*)'
    ],
  }