const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const admin = require('firebase-admin');
const credentials = require('./key.json');
const pug = require('pug');
const { response} = require('express');

//const credentials = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
const db = admin.firestore();
const axios = require('axios');
app.set('view engine', 'pug'); // Ustawienie silnika widoków na pug
app.set('views', __dirname + '/views'); // Katalog z widokiem
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// router.get
//app.get('/create', function (req, res) {
   // res.sendFile('index.html', { root: 'public' });
app.post('/signup', async (req, res) => {
    console.log(req.body);
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const userResponse = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false
    });
    res.json(userResponse);
})
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);

});