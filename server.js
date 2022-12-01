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
    let query = "SELECT Codes.code, Codes.incident_type AS type FROM Codes";
    let params = [];
    let clause = "WHERE";
    if (req.query.hasOwnProperty("code")) {
        query = query + " " + clause + " Codes.code IN (";
        let commaCheck = req.query.code.split(",");
        if (commaCheck.length >= 1) {
            const placeholders = commaCheck.map(() => "?").join(",");
            query = query + placeholders + ", ";
            params.push(commaCheck);
        }
        query = query + commaCheck + ") ORDER BY code";
    }


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
    let query = 'SELECT case_number, SUBSTRING(date_time, 1, 10) AS date, SUBSTRING(date_time, 12, 19) AS time, code, incident, police_grid, neighborhood_number, block FROM Incidents';
    let params = []; 

    if (req.query.hasOwnProperty('start_date')) { 
        let params = [];
        let clause = 'WHERE';
        if(query.includes(clause)){ 
            clause = 'AND';
        }
        query = query + ' ' + clause + ' date >= '; 
        let startDate = req.query.start_date;
        params.push(req.query.start_date);
        query = query + '"' + startDate + '"';
    }

    if (req.query.hasOwnProperty('end_date')) {
        let params = [];
        let clause = 'WHERE';
        if(query.includes(clause)){ 
            clause = 'AND';
        }
        query = query + ' ' + clause + ' date <= '; 
        let endDate = req.query.end_date;
        params.push(req.query.end_date);
        query = query + '"' + endDate + '"';
    }

    if (req.query.hasOwnProperty('code')) { 
        let params = [];
        let clause = 'WHERE';
        if(query.includes(clause)){ 
            clause = 'AND';
        }
        query = query + ' ' + clause + ' Incidents.code = ';
        let code = req.query.code;
        params.push(req.query.code);
        query = query + code;
    }

    if (req.query.hasOwnProperty('grid')) { 
        let params = [];
        let clause = 'WHERE';
        if(query.includes(clause)){ 
            clause = 'AND';
        }
        query = query + ' ' + clause + ' Incidents.police_grid IN ('; 
        let grid = req.query.grid.split(',');
        if(grid.length >= 1){
            const placeholders = grid.map(() => "?").join(",");
            query = query + placeholders + ', ';
            params.push(grid);
        }
        query = query + grid + ')';
    }

    if (req.query.hasOwnProperty('neighborhood')) {
        let params = [];
        let clause = 'WHERE';
        if(query.includes(clause)){ 
            clause = 'AND';
        }
        query = query + ' ' + clause + ' Incidents.neighborhood_number IN (';
        let commaCheck = req.query.neighborhood.split(',');
        if (commaCheck.length >= 1) {
            const placeholders = commaCheck.map(() => "?").join(",");
            query = query + placeholders + ', ';
            params.push(commaCheck);
        }
        query = query + commaCheck + ')';
    }

    query = query + ' ORDER BY date, time'; //Adds ORDER BY clause before LIMIT clause. 

    if (req.query.hasOwnProperty('limit')) {
        let params = [];
        query = query + ' LIMIT ';
        let limit = req.query.limit;
        params.push(limit);
        query = query + limit;
    } else{ //by default the limit should be 1000
        query = query + ' LIMIT 1000';
    }

    db.all(query, params, (err, rows) => {
        if (err){
            console.log(err);
        }
        res.status(200).type('json').send(rows); 
        console.log(query);
    });
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
app.delete('/remove-incident', (req, res) => {
    let case_number = req.body.case_number;
    console.log(case_number); // uploaded data
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

