import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

class Fire {
    constructor(callback) {
        this.callback = callback;
        this.unsubscribe = null;
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
                        this.callback(error, null);
                    });
            }
        });
    }

    getLists(callback) {
        const userId = this.userId;
        if (!userId) return;

        const ref = query(this.ref, orderBy("name"));
        this.unsubscribe = onSnapshot(ref, (snapshot) => {
            const lists = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            callback(lists);
        });
    }

    addList(list) {
        return addDoc(this.ref, list);
    }

    updateList(list) {
        const docRef = doc(db, "users", this.userId, "lists", list.id);
        return updateDoc(docRef, list);
    }

    get userId() {
        return auth.currentUser ? auth.currentUser.uid : null;
    }
    
    get ref() {
        return collection(db, "users", this.userId, "lists");
    }
    
    detach() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
}

export default Fire;
