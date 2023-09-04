

const path = require('path');
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const credentials = require('./key.json');
const { response} = require('express');
//const credentials = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
const db = admin.firestore();
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
    res.sendFile('index.html', {root: 'public'})

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
// import {CreateEnd} from ".create";
// READ OPERACJA
app.get('/read', async (req, res) => {
    try {
        const usersRef = db.collection("Concacts");
        // dodalem  .add(userJson);
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
        responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch(error) {
        res.status(500).send(error.message);
    }
});
/* FUNKCJA TESTOWA
 app.get('form', (req, res) => {

     res.sendFile()(__dirname + 'pusty/index.html');
 })

app.post('/formPost', (req,res) =>{
console.log(req.body);
})
*/
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
app.post('/update', async (req, res) => {
    try {
        const id = req.body.id;
        const newFirstName = "Adam";
        const newLastName = "Stodola";
        const newCategory = "Friends";
        const newEmail = "332@gmail.com";
        const newPassword = "123123123";
        const newPhoneNumber = "000000000";

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
//READ OPERACJA DELETE
app.delete('/delete/:id', async (req, res) => {
    try {
        const response = await db.collection("Concacts").doc(req.params.id).delete();
        res.send(response);
    }   catch(error) {
        res.send(error);
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

        // Wysyłamy dane do endpointu /create na serwerze
        /* fetch('http://localhost:8080/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userJson)
        })
            .then(response => response.json())
            .then(data => {
                res.send(data); // Zwracamy odpowiedź z ID dodanego dokumentu
            })
            .catch(error => {
                console.error(error);
                res.send(error);
            }); */
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