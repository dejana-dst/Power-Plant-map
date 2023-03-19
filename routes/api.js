let express = require('express'); // require Express
let router = express.Router(); // setup usage of the Express router engine

let pg = require("pg"); // require Postgres module
let username = "postgres" // sandbox username
let password = "password" // read only privileges on our table
let host = "localhost:5432"
let database = "nuclear" // database name
let conString = "postgres://"+username+":"+password+"@"+host+"/"+database; // Your Database Connection

let power_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM "+
"(SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((lg.id, name,country_name,status,description)) As properties "+
"FROM power_plants As lg,countries,status_type,reactor_type where countries.code=country_code and status_id=status_type.code and reactor_type.id=reactor_type_id) As f) As fc";


router.get('/data', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query(power_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});

router.post('/data', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    console.log(req.body)
    let queryString="INSERT INTO power_plants (name,latitude,longitude,country_code,status_id,reactor_type_id,geom) "+
    "VALUES ('"+req.body.name+"',"+req.body.latitude+","+req.body.longitude+",'"+
    req.body.country_code+"',"+req.body.status_id+","+req.body.reactor_type_id+",ST_SetSRID(ST_MakePoint("+req.body.longitude+","+req.body.longitude+"),4326))";
    console.log(queryString)
    let query = client.query(queryString);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0]);
        res.end();
    });
});

router.get('/data/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM power_plants where id="+req.params.id);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.patch('/data/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM power_plants where id="+req.params.id);
    query.on("row", function (row, result) {
        result.addRow(row);
        
    });
    query.on("end", function (result) {
        result.rows.name=req.body.name || result.rows.name
        result.rows.latitude=req.body.latitude || result.rows.latitude
        result.rows.longitude=req.body.longitude || result.rows.longitude
        result.rows.country_code=req.body.country_code || result.rows.country_code
        result.rows.status_id=req.body.status_id || result.rows.status_id
        result.rows.reactor_type_id=req.body.reactor_type_id || result.rows.reactor_type_id
        let queryString="update power_plants set name='"+result.rows.name+"',latitude="+result.rows.latitude+",longitude="+result.rows.longitude+",country_code='"+
        result.rows.country_code+"',status_id="+result.rows.status_id+",reactor_type_id="+result.rows.reactor_type_id+",geom=(ST_SetSRID(ST_MakePoint("+result.rows.longitude+","+result.rows.longitude+"),4326))"+
        "where id="+req.params.id;
        console.log(queryString)
        let query2 = client.query(queryString);
        query2.on("row", function (row, result) {
            result.addRow(row);
        });
        query2.on("end", function (result) {
            res.send(result.rows[0]);
            res.end();
        });

    });
});

router.delete('/data/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("delete FROM power_plants where id="+req.params.id);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.get('/countries', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM countries");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.get('/countries/:code', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM countries where code='"+req.params.code+"'");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.get('/status', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM status_type ");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.get('/status/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM status_type where code="+req.params.id);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.delete('/status/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("delete * FROM status_type where id="+req.params.id);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});
router.get( '/reactors',function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM reactor_type ");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.post('/reactors',function (req, res) {

    let client = new pg.Client(conString);
    client.connect();   
    let query = client.query("INSERT INTO reactor_type (type,description) VALUES ('"+req.body.type+"','"+req.body.description+"')");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.get('/reactors/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("SELECT * FROM reactor_type where id="+req.params.id);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.patch('/reactors/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let queryString="update reactor_type set "
    if(req.body.type && req.body.description)
        queryString+=" type='"+req.body.type+"', description='"+req.body.description+"' where id="+req.params.id;
    else if(req.body.type)
        queryString+=" type='"+req.body.type+"' where id="+req.params.id;
    else if(req.body.description)
        queryString+=" description='"+req.body.description+"' where id="+req.params.id;
 
    let query = client.query(queryString );
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.delete('/reactors/:id', function (req, res) {
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query("delete FROM reactor_type where id="+req.params.id);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

module.exports = router;