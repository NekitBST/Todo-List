import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

class Fire {
    constructor(callback) {
        this.callback = callback;
        this.init();
    }

    init() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.callback(null, user);
            } else {
                signInAnonymously(auth)
                    .then(({ user }) => {
                        this.callback(null, user);
                    })
                    .catch(error => {
                        this.callback(error);
                    });
            }
        });
    }

    getLists(callback) {
        if (!this.userId) return;

        const ref = collection(doc(collection(db, "users"), this.userId), "lists");

        this.unsubscribe = onSnapshot(ref, (snapshot) => {
            const lists = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            callback(lists);
        });
    }

    get userId() {
        return auth.currentUser ? auth.currentUser.uid : null;
    }
    
    detach() {
        this.unsubscribe();
    }
}

export default Fire;