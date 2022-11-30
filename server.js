// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3')

let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
let port = 8000;

app.use(express.json());

// Open SQLite3 database (in read-only mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});


// GET request handler for crime codes
app.get('/codes', (req, res) => {
    console.log(req.query);

    let query = "SELECT Codes.code, Codes.incident_type AS type FROM Codes";
    let params = [];
    let clause = "WHERE";
    if (req.query.hasOwnProperty("code")) {
        query = query + " " + clause + " Codes.code = ?";
        params.push(req.query.code);
    }

    query = query + " " + "ORDER BY code";

    db.all(query, params, (err, rows) => {
        console.log(err);
        res.status(200).type("json").send(rows);
    });
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    let query = 'SELECT Neighborhoods.neighborhood_number AS id, Neighborhoods.neighborhood_name AS name FROM Neighborhoods';
    let params = [];
    let clause = 'WHERE';

    //This commented-out section works, trying to do this a better way...
    /*
    if(req.query.hasOwnProperty('id')){ //jerry-rigged solution..
        query = query + ' ' + clause + ' id IN ('; //put ? back and push the array as a string with just ints and commas. 
        let commaCheck = req.query.id.split(',');
        let id;
        if(commaCheck.length > 1){
            let i;
            for(i = 0; i <= commaCheck.length - 1; i++){
                query = query + commaCheck[i]; //Should we force throw an error if user enters an invalid id..?? 
                //params.push(parseInt(commaCheck[i])); //struggled pushing the list of ints so went another route.
                if(i !== commaCheck.length - 1){ //don't add comma if last item
                    query = query + ', ';
                } else{
                    query = query + ') ORDER BY id';
                }
            }
        }
    }
    */

    if (req.query.hasOwnProperty('id')) {
        query = query + ' ' + clause + ' id IN (';
        let commaCheck = req.query.id.split(',');
        if (commaCheck.length >= 1) {
            const placeholders = commaCheck.map(() => "?").join(",");
            query = query + placeholders + ', ';
            params.push(commaCheck);
        }
        query = query + commaCheck + ') ORDER BY id';
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.status(200).type('json').send(rows);
    });
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    //Return JSON object with list of crime incidents (ordered by date/time). Note date and time should be separate fields.
    //Filter for start_date and end_date
    //Filter for code from comma separated list
    //Filter for police grid numbers from comma separated list
    //Filter for neighborhood id number from comma separated list
    //Filter for limit number for max number of incidents to include in returned json

    //have a query var that each of the properties add to, think about how the appending logic works...
    let query;

    if (req.query.hasOwnProperty('start_date')) {
        let query = "SELECT Incidents.date_time FROM Incidents";
        let params = [];
        let clause = "WHERE";
        if(query.includes(clause)){ //check if already a where clause 
            clause = 'AND';
        }
        query = query + " " + clause + " Incidents.date_time = ?";
        params.push(req.query.code);
        query = query + " " + "ORDER BY date_time";

        db.all(query, params, (err, rows) => {
            if(err){
                console.log(err);
            }
            res.status(200).type("json").send(rows);
        });
    }

    if (req.query.hasOwnProperty('end_date')) {
        let query = "SELECT Incidents.date_time FROM Incidents";
        let params = [];
        let clause = "WHERE";
        if(query.includes(clause)){ //check if already a where clause 
            clause = 'AND';
        }
        query = query + " " + clause + " Incidents.date_time = ?";
        params.push(req.query.code);
        query = query + " " + "ORDER BY date_time";

        db.all(query, params, (err, rows) => {
            if(err){
                console.log(err);
            }
            res.status(200).type("json").send(rows);
        });
    }
    

    if (req.query.hasOwnProperty('code')) { //WILL NEED TO CHANGE WHEN COMMAS ARE ACCOUNTED FOR...
        let query = "SELECT Codes.code, Codes.incident_type AS type FROM Codes";
        let params = [];
        let clause = "WHERE";
        if(query.includes(clause)){ //check if already a where clause 
            clause = 'AND';
        }
        query = query + " " + clause + " Codes.code = ?";
        params.push(req.query.code);
        query = query + " " + "ORDER BY code";

        db.all(query, params, (err, rows) => {
            if(err){
                console.log(err);
            }
            res.status(200).type("json").send(rows);
        });
    }

    if (req.query.hasOwnProperty('grid')) {
        let query = "SELECT Incidents.police_grid FROM Incidents";
        let params = [];
        let clause = "WHERE";
        if(query.includes(clause)){ //check if already a where clause 
            clause = 'AND';
        }
        query = query + " " + clause + " Incidents.police_grid = ?";
        params.push(req.query.code);
        query = query + " " + "ORDER BY police_grid";

        db.all(query, params, (err, rows) => {
            if(err){
                console.log(err);
            }
            res.status(200).type("json").send(rows);
        });
    }
    

    if (req.query.hasOwnProperty('neighborhood')) {
        let query = 'SELECT Neighborhoods.neighborhood_number AS id, Neighborhoods.neighborhood_name AS name FROM Neighborhoods';
        let params = [];
        let clause = 'WHERE';
        if(query.includes(clause)){ //check if already a where clause 
            clause = 'AND';
        }
        query = query + ' ' + clause + ' id IN (';
        let commaCheck = req.query.id.split(',');
        if (commaCheck.length >= 1) {
            const placeholders = commaCheck.map(() => "?").join(",");
            query = query + placeholders + ', ';
            params.push(commaCheck);
        }
        query = query + commaCheck + ') ORDER BY id';

        db.all(query, params, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.status(200).type('json').send(rows);
        });

    }

    //if (req.query.hasOwnProperty('limit')) {

    //}



    res.status(200).type('json').send({}); //don't think will need this since doing for each property??
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    //Upload incident data to be inserted into the SQLite3 database
    //Data fields: case_number, date, time, code, incident, police_grid, neighborhood_number, block
    //Note: response should reject (status 500) if the case number already exists in the database

    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});

// DELETE request handler for new crime incident
app.delete('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    //Remove data from the SQLite3 database
    //Data fields: case_number
    //Note: reponse should reject (status 500) if the case number does not exist in the database
    

    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});


// Create Promise for SQLite3 database SELECT query 
function databaseSelect(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        })
    })
}

// Create Promise for SQLite3 database INSERT or DELETE query
function databaseRun(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })
}


// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});


//THIS IS WHAT ENTERED INTO MAC TERMINAL IN CLASS FRIDAY: curl -X PUT "http://localhost:8000/new-incide" -H "Content-Type: application/json" -d "{\"key1\": 42}"