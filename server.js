
const { getAuth, signInWithEmailAndPassword, signOut } = require('firebase/auth');

const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const admin = require('firebase-admin');
const credentials = require('./key.json');
const pug = require('pug');
const { response} = require('express');
const auth = require('firebase/auth')
//const credentials = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
const db = admin.firestore();
const axios = require('axios');

const { initializeApp: initializeAdminApp } = require("firebase-admin/app");
const {initializeApp} = require("firebase/app");
app.set('view engine', 'pug'); // Ustawienie silnika widoków na pug
app.set('views', __dirname + '/views'); // Katalog z widokiem
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

const firebaseConfig = {
    apiKey: "AIzaSyD7Ayo36UyEFLGq939UA1YPuqM89VPdZdI",
    authDomain: "learn-380a2.firebaseapp.com",
    projectId: "learn-380a2",
    storageBucket: "learn-380a2.appspot.com",
    messagingSenderId: "497072739065",
    appId: "1:497072739065:web:a088778dc51e3e6dc9c828",
    measurementId: "G-LWZNQYYBQ2"
};


app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    admin
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`Zalogowano użytkownika: ${user.email}`);
            res.send(`Zalogowano użytkownika: ${user.email}`);
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error(`Błąd logowania: ${errorMessage}`);
            res.status(401).send(`Błąd logowania: ${errorMessage}`);
        });
});

// router.get
//app.get('/create', function (req, res) {
   // res.sendFile('index.html', { root: 'public' });
/*
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log(`Logged in as: ${user.email}`);
        res.render('logged-in', { email: user.email });
    } catch (error) {
        const errorMessage = error.message;
        console.error(errorMessage);
        res.status(400).render('error', { error: errorMessage });
    }
});

 */
/*
app.post('/login', async (req, res) => {
    try {
        // ... pozostała część kodu ...

        // Sprawdzenie poprawności logowania i wysłanie odpowiedzi
    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({ error: error.message });
    }
});
*/
/*
app.post('/login', async (req, res) => {
    try {

        if (!req.body.idToken || typeof req.body.idToken !== 'string') {
            return res.status(400).json({ error: 'Brak prawidłowego idToken w zapytaniu' });
        }

        const idToken = req.body.idToken;
        const decodedToken = await admin.auth().verifyIdToken(idToken, false);
        const userUid = decodedToken.uid;
        res.json({ message: 'Logowanie udane', uid: userUid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            res.send(`Logged in as: ${user.email}`);

        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error(errorMessage);
            res.status(400).send(`Error: ${errorMessage}`);
        });
});
*/
/*
app.post('/login', (req, res) => {
    const email = req.body.login_email;
    const password = req.body.login_password;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            res.send(`Logged in as: ${user.email}`);

        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error(errorMessage);
            res.status(400).send(`Error: ${errorMessage}`);
        });
});

*/

/*
app.post('/login', async (req, res) => {

    var auth1 = auth.getAuth();

    signInWithEmailAndPassword(auth1, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
            res.json({ message: 'Rejestracja udana', uid: userUid });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
})
*/


app.post('/signup', async (req, res) => {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password
        };

        const userRecord = await admin.auth().createUser({
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false
        });
        const userUid = userRecord.uid;
        res.json({ message: 'Rejestracja udana', uid: userUid });
    } catch (error) {
        // Obsługa błędów
        res.status(500).json({ error: error.message });
    }
});

app.get('/',function(req,res) {
    res.sendFile('start.html', {root: 'public'})

    app.post('/create', async function (req, res) {
        try {
            const userJson = {
                Email: req.body.Email,
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                PhoneNumber: req.body.PhoneNumber,
                Password: req.body.Password,
                Category: req.body.Category
            };
            const response = await db.collection("Concacts").add(userJson);
            res.send("Create Successful");
            // res.send(response.id);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
    });
    //__dirname : It will resolve to your project folder.
// CREATE OPERACJA
app.post('/create', async (req, res) => {
    try {
        console.log(req.body);
        const id = req.body.Email;
        const userJson = {
            Email: req.body.Email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            PhoneNumber: req.body.PhoneNumber,
            Password: req.body.Password,
            Category: req.body.Category
        };
        const response = await db.collection("Concacts").add(userJson);
        res.send("Create Successful");
        //res.send(response.id);
        // dodalem .id
    } catch(error) {
   // res.send(error);
    res.status(500).send(error.message);
    }
});
// READ OPERACJA
app.get('/read', async (req, res) => {
    try {
        const usersRef = db.collection("Concacts");
        // dodalem  .add(userJson);
        const response = await usersRef.get();
        const responseArr = response.docs.map(doc => {
            const data = doc.data();
            return {id: doc.id, ...data};
        });

        res.render('contacts', { contacts: responseArr });
        //res.send(responseArr);
    } catch(error) {
        res.status(500).send(error.message);
    }
});

// READ OPACAJA PO ID
app.get('/read/:id', async (req, res) => {
    try {
        const userRef = db.collection("Concacts").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch(error) {
        res.send(error);
    }
});
// READ OPERACJA UPDATE


/*
app.post('/update', async (req, res) => {
    try {

                   const id = req.body.id;
                   const newFirstName = "Adam";
                   const newLastName = "Stodola";
                   const newCategory = "Friends";
                   const newEmail = "332@gmail.com";
                   const newPassword = "123123123";
                   const newPhoneNumber = "000000000";


               const id = req.body.id;
               const newFirstName = req.body.newFirstName;
               const newLastName = req.body.newLastName;
               const newCategory = req.body.newCategory;
               const newEmail = req.body.newEmail;
               const newPassword = req.body.newPassword;
               const newPhoneNumber = req.body.newPhoneNumber;

        const userRef = await db.collection("Concacts").doc(id)
            .update({
                FirstName: newFirstName,
                LastName: newLastName,
                Category: newCategory,
                Email: newEmail,
                Password: newPassword,
                PhoneNumber: newPhoneNumber
            });
       // res.redirect('/');
        res.send(userRef);
    }   catch(error) {
        res.send(error);
    }
});

*/
//READ OPERACJA DELETE

app.post('/update', async (req, res) => {
    try {
        const id = req.body.id; // Unikalne pole, które identyfikuje użytkownika
        const newFirstName = req.body.newFirstName;
        const newLastName = req.body.newLastName;
        const newCategory = req.body.newCategory;
        const newEmail = req.body.newEmail;
        const newPassword = req.body.newPassword;
        const newPhoneNumber = req.body.newPhoneNumber;


        const userRef = await db.collection("Concacts").doc(id)
            .update({
                FirstName: newFirstName,
                LastName: newLastName,
                Category: newCategory,
                Email: newEmail,
                Password: newPassword,
                PhoneNumber: newPhoneNumber
            });
                res.send(userRef);
            }   catch(error) {
                res.send(error);
            }
});

app.post('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log('ID do usunięcia:', id); // Dodaj ten log
        await db.collection("Concacts").doc(id).delete();
        res.sendStatus(204); // Odpowiedź HTTP 204 No Content po udanym usunięciu
    } catch (error) {
        console.error('Błąd podczas usuwania kontaktu:', error);
        res.status(500).send(error.message);
    }
});

app.post('/formPost', (req, res) => {
    try {
        const userJson = {
            Email: req.body.Email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            PhoneNumber: req.body.PhoneNumber,
            Password: req.body.Password,
            Category: req.body.Category
        };
        db.collection("Concacts").add(userJson)
            .then(docRef => {
                res.send({id: docRef.id});
            })
    } catch(error) {
        console.error(error);
        res.send(error);
    }
    });

// Dodaj nowy endpoint, np. '/listUsers', który będzie wyświetlał UID użytkowników
app.get('/listUsers', async (req, res) => {
    try {
        // Pobierz wszystkich użytkowników z Firebase Authentication
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users;

        // Pobierz UID każdego użytkownika i dodaj do tablicy
        const uids = users.map((user) => user.uid);

        res.json({ uids });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);

});