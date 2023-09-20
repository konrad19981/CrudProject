const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Ścieżka do klucza usługi Firebase Admin SDK

// Inicjalizacja aplikacji Express.js
const app = express();

// Inicjalizacja Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://learn-380a2.firebaseio.com' // Zastąp tym odpowiednią ścieżką do Twojej bazy danych Firebase
});

// Parsowanie ciała żądania POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Obsługa żądania POST /login
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);

});