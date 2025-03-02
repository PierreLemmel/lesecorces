import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { EcorcesCropArea } from "../server/server";
import { cropImage } from "../server/images";




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

export function getCroppedPathForImage(path: string, area: EcorcesCropArea) {
    const { x, y, width, height } = area;
    const pathChunks = path.split('.')
    const extension = pathChunks.pop();
    const pathBase = pathChunks.join('.');

    return `${pathBase}_${x}-${y}-${width}-${height}.${extension}`;
}


export async function addCroppedVersionToStorage(path: string, area: EcorcesCropArea) {
    const original = await getFileFromStorage(path);

    const [buffer] = await original.download();
    const metadata = await original.getMetadata();
    const contentType = metadata[0].contentType || "application/octet-stream";


    const croppedPath = getCroppedPathForImage(path, area);

    const bucket = getStorage().bucket();
    const croppedFile = bucket.file(croppedPath);

    const croppedBuffer = await cropImage(buffer, area);

    await croppedFile.save(croppedBuffer, {
        metadata: {
            contentType
        },
        public: true
    })
}