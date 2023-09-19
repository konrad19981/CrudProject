import { getAuth, signOut } from "firebase/auth";
app.post('/login', async (req, res))
const auth = getAuth();
signOut(auth).then(() => {
    // Sign-out successful.
}).catch((error) => {
    // An error happened.
});