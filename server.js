const { getAuth, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const session = require('express-session');

const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
const pug = require('pug');
const { response} = require('express');
const auth = require('firebase/auth')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://learn-380a2-default-rtdb.firebaseio.com"
});
const db = admin.firestore();
const axios = require('axios');
const pugStatic = require('express-pug-static');
app.use(pugStatic({
    baseDir: path.join(__dirname, '/views'),
    baseUrl: '/views',
    maxAge: 86400,
    pug: { pretty: true}
}));
app.set('view engine', 'pug'); // Ustawienie silnika widoków na pug
app.set('views', __dirname + '/views'); // Katalog z widokiem
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({
    secret: 'sd@asdx!#54@xvks0AsxD',
    resave: false,
    saveUninitialized: true
}));
const { initializeApp } = require("@firebase/app");
const { initializeApp: initializeAdminApp } = require('firebase-admin/app');
const { getAuth: getAdminAuth, createCustomToken } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log(`Zalogowano użytkownika: ${user.email}`);
        res.render('logged-in', { email: user.email });
    } catch (error) {
        const errorMessage = error.message;
        console.error(`Błąd logowania: ${errorMessage}`);
        res.status(400).send(`Błąd logowania: ${errorMessage}`);
    }
});
app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Nie można się wylogować');
            } else {
                // Wyloguj użytkownika z Firebase
                signOut(auth)
                    .then(() => {
                        console.log("Wylogowano użytkownika z Firebase.");
                        res.redirect('/login');
                    })
                    .catch((error) => {
                        console.error("Błąd wylogowywania z Firebase:", error);
                        res.redirect('/login');
                    });
            }
        });
    } else {
        res.redirect('/login');
    }
});

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

        // redirect przekierowanie
        res.redirect('/login.html');
    } catch (error) {
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
           // res.send("Create Successful");
            // res.send(response.id);
            res.redirect('/login');
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
    });
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
        res.redirect('/read');
    } catch(error) {
    res.status(500).send(error.message);
    }
});
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
app.get('/read/:id', async (req, res) => {
    try {
        const userRef = db.collection("Concacts").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch(error) {
        res.send(error);
    }
});

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
              //  res.send(userRef);
        res.redirect('/read');
            }   catch(error) {
                res.send(error);
            }
});

app.post('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log('ID do usunięcia:', id);
        await db.collection("Concacts").doc(id).delete();
        res.redirect('/read');
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
app.get('/listUsers', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users;
        const uids = users.map((user) => user.uid);
        res.json({ uids });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/logout1', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.send('Logout successful')
            }
        });
    } else {
        res.end()
    }
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);

});