var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var google = require('googleapis');
var sql = require('./Server/mysql.js');

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


function updateRow(tableName, obj, callback) {
    var arrayFromObject = Object.keys(obj).map(key => obj[key]);
    var keysFromObject = Object.keys(obj).map(key => key);
    sql.updateRow(tableName, arrayFromObject, keysFromObject, function (err, data) {
        if (err) {
            console.log(err);
            callback({
                error: 'היתה בעיה בעת עדכון הנתון'
            })
        } else {
            callback({
                data: data,
                success: '!הנתון עודכן בהצלחה במערכת'
            })
        }
    })
}

function deleteRow(tableName, objId, callback) {
    sql.deleteRow(tableName, objId, function (err, data) {
        if (err) {
            console.log(err);
            callback({
                error: 'היתה בעיה בעת מחיקת הנתון'
            })
        } else {
            callback({
                data: data,
                success: '!הנתון נמחק בהצלחה מהמערכת'
            })
        }
    });
}

function selectAll(tableName, callback) {
    sql.selectAll(tableName, function (err, data) {
        if (err) {
            console.log(err);
            callback({
                error: 'היתה בעיה בעת שליפת הנתונים'
            })
        } else {
            callback(data)
        }
    })
}


/**
 * Potentails API
 */
app.delete('/deletePotential/:id', function (req, res) {
    var objId = req.params.id;

    deleteRow('tb_orders', objId, function (data) {
        res.send(data);
    })
});

app.post('/updatePotential', function (req, res) {
    var obj = req.body.data;

    var Potential = {};

    obj.id && (Potential.id = obj.id)
    Potential.date = obj.date;
    Potential.customer_id = obj.customer_id;
    Potential.product_id = obj.product_id;
    Potential.amount = obj.amount;
    Potential.offer_comments = obj.offer_comments;
    Potential.comments = obj.comments;
    Potential.offer = obj.offer;
    Potential.status_id = obj.status_id;




    updateRow('tb_orders', Potential, function (data) {
        res.send(data)
    })
});

app.get('/getPotentials', function (req, res) {

    sql.selectQuery.getPotentials(function (err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: 'היתה בעיה בשליפת הנתונים'
            })
        } else {
            res.send(data)
        }
    })
});


/**
 * Invitations API
 */
app.delete('/deleteInvitation/:id', function (req, res) {
    var objId = req.params.id;

    deleteRow('tb_orders', objId, function (data) {
        res.send(data);
    })
});

app.post('/updateInvitation', function (req, res) {
    var obj = req.body.data;

    var Invitation = {
        date: obj.date,
        customer_id: obj.customer_id,
        product_id: obj.product_id,
        amount: obj.amount,
        airline: obj.airline,
        customer_cost: obj.customer_cost,
        docket_id: obj.docket_id,
        comments: obj.comments,
        status_id: 4
    }

    obj.id && (Invitation.id = obj.id);

    updateRow('tb_orders', Invitation, function (data) {
        res.send(data)
    })
});

app.get('/getInvitations', function (req, res) {
    sql.selectQuery.getInvitations(function (err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: 'היתה בעיה בעת שליפת הנתונים'
            })
        } else {
            res.send(data)
        }
    });
})


/**
 * Customers API
 */
app.delete('/deleteCustomer/:id', function (req, res) {
    var objId = req.params.id;

    deleteRow('tb_customers', objId, function (data) {
        res.send(data);
    })
});

app.post('/updateCustomer', function (req, res) {
    var obj = req.body.data;

    updateRow('tb_customers', obj, function (data) {
        res.send(data)
    })
});

app.get('/getCustomers', function (req, res) {
    selectAll('tb_customers', function (data) {
        res.send(data);
    });
})


/**
 * Actions API
 */
app.get('/getActions', function (req, res) {
    res.send({

    })
})


/**
 * Reports API
 */


/**
 * Expenses API
 */
app.delete('/deleteExpense/:id', function (req, res) {
    var objId = req.params.id;

    deleteRow('tb_expenses', objId, function (data) {
        res.send(data);
    })
});

app.post('/updateExpense', function (req, res) {
    var obj = req.body.data;

    updateRow('tb_expenses', obj, function (data) {
        res.send(data)
    })
});

app.get('/getExpenses', function (req, res) {
    selectAll('tb_expenses', function (data) {
        res.send(data);
    });
});


/**
 * Incomes API
 */
app.delete('/deleteIncome/:id', function (req, res) {
    var objId = req.params.id;

    deleteRow('tb_incomes', objId, function (data) {
        res.send(data);
    })
});

app.post('/updateIncome', function (req, res) {
    var obj = req.body.data;

    updateRow('tb_incomes', obj, function (data) {
        res.send(data)
    })
});

app.get('/getIncomes', function (req, res) {
    selectAll('tb_incomes', function (data) {
        res.send(data);
    });
});

/**
 * Points API
 */
app.delete('/deletePoint/:id', function (req, res) {
    var objId = req.params.id;

    deleteRow('tb_points', objId, function (data) {
        res.send(data);
    })
});

app.post('/updatePoint', function (req, res) {

    var obj = req.body.data;

    updateRow('tb_points', obj, function (data) {
        res.send(data)
    })
});

app.get('/getPoints', function (req, res) {
    selectAll('tb_points', function (data) {
        res.send(data);
    });
});

/**
 * Other API
 */
app.get('/getProducts', function (req, res) {
    selectAll('tbk_products', function (data) {
        res.send(data);
    })
})

app.get('/getStatus', function (req, res) {
    selectAll('tbk_status', function (data) {
        res.send(data);
    })
})

app.get('/getOrigins', function (req, res) {
    selectAll('tbk_origins', function (data) {
        res.send(data);
    })
})

app.get('/getExpenseCategories', function (req, res) {
    selectAll('tbk_expense_categories', function (data) {
        res.send(data);
    })
})