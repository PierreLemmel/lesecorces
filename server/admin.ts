import { verifySessionCookie } from "../lib/firebase-server";

export async function verifyThatSessionCookieIsAdmin(token: string) {
    const decoded = await verifySessionCookie(token);
console.log("decoded", decoded);
    return decoded.email === process.env.ADMIN_EMAIL;
}