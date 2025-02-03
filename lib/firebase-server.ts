import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";




if (!getApps().length) {

    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY ?? "");

    initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
}


export async function createSessionCookie(token: string, expiresIn: number) {

    const cookie = await getAuth().createSessionCookie(token, { expiresIn });
    return cookie;
}

export async function verifySessionCookie(sessionCookie: string) {
    const result = await getAuth().verifySessionCookie(sessionCookie, true);
    return result;
}

export async function getFileFromStorage(path: string) {
    const bucket = getStorage().bucket();
    const file = bucket.file(path);
    
    return file;
}