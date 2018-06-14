
var mysql = require('mysql');

//Put your mysql configuration settings - user, password, database and port
// function getConnection(){
    //var connection = mysql.createConnection({
    var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : 'kimtani02',
        database : 'cmpe273',
        port	 : 3306
    });
    /*return connection;
}*/


function fetchData(callback,sqlQuery){

    console.log("\nSQL Query::"+sqlQuery);

    pool.getConnection(function(err,connection) {

        connection.query(sqlQuery, function (err, rows, fields) {
            if (err) {
                console.log("ERROR: " + err.message);
            }
            else {	// return err or result
                console.log("DB Results:" + rows);
                callback(err, rows);
            }
        });
        console.log("\nConnection closed..");
        connection.release();
    });
}

function executeQuery(callback, sqlQuery){

    console.log("\nSQL Query::"+sqlQuery);


    pool.getConnection(function(err,connection) {

        connection.query(sqlQuery, function (err, result) {
            callback(err);
        });
        console.log("\nConnection closed..");
        connection.release();
    });
}


exports.fetchData=fetchData;
exports.executeQuery=executeQuery;



