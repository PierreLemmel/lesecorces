import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, getFirestore, initializeFirestore, setDoc, updateDoc, WithFieldValue } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type FirebaseProps = {
    app: ReturnType<typeof initializeApp>;
    db: ReturnType<typeof getFirestore>;
    storage: ReturnType<typeof getStorage>;
    auth: ReturnType<typeof getAuth>;
}


export function toFirebaseKey(input: string) {
    return input.replace(/\s/g, "").toLowerCase();
}

export function firebasePathesAreEquivalent(lhs: string, rhs: string) {
    return lhs.toLowerCase() === rhs.toLowerCase();
}

let firebase: FirebaseProps|null = null;
function getFirebase(): FirebaseProps {

    if(!firebase) {

        const app = initializeApp(firebaseConfig);

        initializeFirestore(app, {
            ignoreUndefinedProperties: true
        })
        const db = getFirestore(app);
        const storage = getStorage(app);
        const auth = getAuth(app);

        firebase = {
            app, db, storage, auth
        }
    };

    return firebase;
}


export async function documentExists(path: string) {
    const { db } = getFirebase();
    const firedoc = await getDoc(doc(db, path));

    return firedoc.exists();
}

export async function getDocument<T>(path: string) {
    const { db } = getFirebase();
    const firedoc = await getDoc(doc(db, path));
    
    return <T> firedoc.data();
}

export async function setDocument<T extends WithFieldValue<DocumentData>>(path: string, data: Partial<T>, merge: boolean = true) {
    const { db } = getFirebase();
    
    await setDoc(
        doc(db, path),
        data,
        { merge }
    );
}

export async function updateDocument<T extends WithFieldValue<DocumentData>>(path: string, values: Partial<T>) {
    const { db } = getFirebase();
    
    const entries = Object.entries(values);

    if (entries.length < 1) {
        throw "updateDocument requires at least two values";
    }
    
    const [firstField, firstValue] = entries[0];

    const moreFieldsAndValues: unknown[] = new Array((entries.length - 1) * 2);

    for (let i = 0; i < entries.length - 1; i++) {
        const [field, value] = entries[i + 1];

        moreFieldsAndValues[i * 2] = field;
        moreFieldsAndValues[i * 2 + 1] = value;
    }

    await updateDoc(
        doc(db, path),
        firstField,
        firstValue,
        ...moreFieldsAndValues
    );
}

export async function deleteDocument(path: string) {
    const { db } = getFirebase();
    await deleteDoc(doc(db, path));
}

export async function renameDocument<T extends WithFieldValue<DocumentData>>(oldPath: string, newPath: string, deleteOld: boolean = true) {

    const data = await getDocument<T>(oldPath);
    await setDocument<T>(newPath, data);

    if (deleteOld) {
        await deleteDocument(oldPath);
    }
}

export async function renameDocumentIfNeeded<T extends WithFieldValue<DocumentData>>(oldPath: string, newPath: string, deleteOld: boolean = true) {

    if (!firebasePathesAreEquivalent(oldPath, newPath)) {
        await renameDocument<T>(oldPath, newPath, deleteOld)
    }
}

export async function listDocuments(path: string) {
    const { db } = getFirebase();

    const col = collection(db, path);
    const docRefs = await getDocs(col);

    const ids = docRefs.docs.map(doc => doc.id);

    return ids;
}