var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var google = require('googleapis');

app.use('/js', express.static(__dirname + '/dist/js'));
app.use('/img', express.static(__dirname + '/dist/img'));
app.use('/lib', express.static(__dirname + '/dist/lib'));
app.use('/templates', express.static(__dirname + '/dist/templates'));
app.use('/files', express.static(__dirname + '/dist/files'));
app.use('/views', express.static(__dirname + '/dist/views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', function (req, res) {
    console.log('enter.html:', new Date().toISOString().slice(0, 19).replace("T", " "));
    res.sendFile(__dirname + "/dist/views/enter.html");
});

var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'https://www.googleapis.com/auth/plus.me'
];

var url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes,

    // Optional property that passes state parameters to redirect URI
    // state: { foo: 'bar' }
});


app.get('/login', function (req, res) {
    res.send(url);
});

app.get('/oauth2callback', function (req, res) {
    var code = req.query.code;

    oauth2Client.getToken(code, function (err, tokens) {

        console.log(err);
        console.log(tokens);
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
            res.redirect('home');
        }

    });

});

app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
})

var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('The App is running on http://localhost:' + port);
});


app.get('/getActions', function (req, res) {
    res.send({
        invitations: [{
                id: 1,
                israel_receipt: false,
                usa_receipt: true,
                gama_paid: false,
                vendor_paid: true
            },
            {
                id: 2,
                israel_receipt: false,
                usa_receipt: true,
                gama_paid: false,
                vendor_paid: true
            },
            {
                id: 4,
                israel_receipt: false,
                usa_receipt: true,
                gama_paid: false,
                vendor_paid: true
            },
            {
                id: 3,
                israel_receipt: false,
                usa_receipt: true,
                gama_paid: false,
                vendor_paid: true
            }
        ],
        actions: []
    })
})


app.delete('/deleteInvitation/:id', function (req, res) {

});

app.post('/updateInvitation', function (req, res) {

});

app.get('/getInvitations', function (req, res) {

})


app.delete('/deleteCustomer/:id', function (req, res) {

});

app.post('/updateCustomer', function (req, res) {

});

app.get('/getCustomers', function (req, res) {
    res.send({
       data: [
            {
                id: 1,
                name: 'sdf',
                phome: '04124',
                email: 'fasdf@.col'
            },
            {
                id: 4,
                name: 'va',
                phome: '04124',
                email: 'fasdf@.col'
            },
            {
                id: 5,
                name: 'gqgf',
                phome: '04124',
                email: 'fasdf@.col'
            },
            {
                id: 2,
                name: 'we',
                phome: '04124',
                email: 'fasdf@.col'
            },
            {
                id: 6,
                name: 'kgf',
                phome: '04124',
                email: 'fasdf@.col'
            },
        ]
    })
 })


app.delete('/deleteExpense/:id', function (req, res) {

});

app.post('/updateExpense', function (req, res) {

});

app.get('/getExpenses', function (req, res) { })

app.delete('/deletePotential/:id', function (req, res) {

});

app.post('/updatePotential', function (req, res) {

});

app.get('/getPotentials', function (req, res) {
    res.send({
        data: [
            {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            }, {
                date: '01/01/2017',
                customer_id: 123,
                customer_name: 'ala',
                customer_phone: 041,
                product_id: 1234,
                product_name: 'bab',
                amount: 1,
                offer_comments: 'fas',
                comments: 'asfdasd',
                offer: 4421.99,
                status_id: 4,
                status_name: 'ready'
            },
        ]
    })
})