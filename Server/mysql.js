var mysql = require('mysql'),
    pool = mysql.createPool({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        multipleStatements: true
    }
    );

function validate(string) {
    // var r = `/('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/g)`;
    // return string ? string.toString().replace(r, "") : '';
    return pool.escape(string) || '';
}

function multiQuery(object, callback) {
    pool.getConnection(function (err, connection) {
        if (err) console.error(err);

        var string = Object.keys(object).map((k) => object[k]).join(';')
        connection.query(string, function (error, results = [], fields = []) {
            connection.release();
            if (error) throw error;

            callback({ error, results, fields });
        });
    });
}

function query(string, callback, arr = []) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error by the connection: ')
            console.log(err);
            console.log(process.env)
            throw err;
        } else {
            connection.query(string, arr, function (error, results = [], fields = []) {
                connection.release();

                if (error) console.error(error);
                callback({
                    error,
                    results,
                    fields
                });
            });
        }
    });
}

function queryMul(string, arr, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error by the connection: ')
            console.log(err);
            throw err;
        } else {
            connection.query(string, arr, function (error, results = [], fields = []) {
                connection.release();

                if (error) console.error(error);
                callback({
                    error,
                    results,
                    fields
                });
            });
        }
    });
}

// Code Example.
// var i = `${sql.i('tb_student', req.body.data)}`
// sql.q(`${sql.v(i)}`, function (data) {
//     console.log(data);
// })

// function insert(table, object) {
//     var request = `INSERT INTO ${table} (${tableStruct[table].join(', ')}) VALUES ('${Object.values(object).join("', '")}');`
//     console.log(request);
//     return request;
// }

// function insertArray(table, array, duplicate) {
//     // Validate Keys and Values.
//     var keys = validate(Object.keys(array[0])),
//         splitKeys = keys.split(/\s*'| |,\s*/).filter(Boolean),
//         values = array.map(value => validate(Object.keys(value).map(v => Array.isArray(value[v]) ? JSON.stringify(value[v]) : value[v])));
//     //array.map(value => validate(Object.keys(value).map(v => value[v])));

//     // Build request string.
//     var request = [
//         'INSERT INTO',
//         table,
//         '(',
//         splitKeys,
//         ') VALUES ',
//         values.map(value => '(' + value + ')')
//         // array.map(val => `( ${Object.values(val).map(v => v ? "'" + v + "'" : 'null').join(", ")})`)
//     ];

//     // Upsert.
//     if (duplicate) {
//         request.push('ON DUPLICATE KEY UPDATE',
//             splitKeys.map((x, i) => x + '=VALUES(' + x + ')'))
//     }

//     return request.join(' ');
// }

function selectAll(tableName, callback) {
    query(`SELECT *
           FROM ${tableName}`,
        function (data) {
            callback(data.error, data.results);
        });
}

function updateRow(tableName, arr, keys, callback) {
    query(`REPLACE INTO ${tableName} (${keys.map(val => val)}) VALUES (${keys.map(val => '? ')})`
        , function (data) {
            callback(data.error, data.results);
        },
        arr)
}

function updateMulRow(tableName, arr, keys, callback){
    var str = `REPLACE INTO ${tableName} (${keys.map(val => val)}) VALUES ${arr.map(val => '(?)')}`;
    arr = arr.map(key => Object.keys(key).map(k => key[k])); 
    query(str
        , function (data) {
            callback(data.error, data.results);
        },
        arr)
}

function deleteRow(tableName, id, callback) {
    query(`DELETE FROM ${tableName} WHERE id = ?`,
        function (data) {
            callback(data.error, data.results);
        }, [id])
}

var selectQuery = {


    getInvitations: (callback) => {
        query(`select t1.*, t2.name as customer_name, t3.code_desc as product_name, t4.shekels, t4.dollars
    from tb_orders t1 
    left outer join tb_customers t2 on (t1.customer_id = t2.id) 
    left outer join tbk_products t3 on (t1.product_id = t3.code)
    left outer join (select order_id, sum(shekels) as shekels, sum(dollars) as dollars
                     from tb_incomes
                     group by order_id) t4 on (t1.id = t4.order_id)
    left outer join tbk_vendors t5 on (t1.vendor_id = t5.code)
    where status_id = 4`, function (data) {
                callback(data.error, data.results);
            });
    },

    getPotentials: (callback) => {
        query(`select t1.*, t2.name as customer_name, t2.phone as customer_phone, t3.*, t4.*
                   from tb_orders t1 
                        left outer join tb_customers t2 on (t1.customer_id = t2.id)
                        left outer join tbk_products t3 on (t1.product_id = t3.code)
                        left outer join tbk_status t4 on (t1.status_id = t4.code)
                   where t1.status_id != 4`, (data) => {
                       callback(data.error, data.results);
                   })
    },

    getActions: (callback) => {
        query(`select t1.id, t1.date, t1.docket_id, t1.israel_receipt, t1.usa_receipt, t1.gama_paid, t1.vendor_paid
        from tb_orders t1`,
         (data) => callback(data.error, data.results))
    }

}

module.exports = {

    selectAll: selectAll,
    updateRow: updateRow,
    updateMulRow: updateMulRow,
    deleteRow: deleteRow,
    selectQuery: selectQuery
};