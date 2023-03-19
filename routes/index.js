let express = require('express'); // require Express
let router = express.Router(); // setup usage of the Express router engine

/* PostgreSQL and PostGIS module and connection setup */
let pg = require("pg"); // require Postgres module
// Setup connection
let username = "postgres" // sandbox username
let password = "password" // read only privileges on our table
let host = "localhost:5432"
let database = "nuclear" // database name
let conString = "postgres://"+username+":"+password+"@"+host+"/"+database; // Your Database Connection

// Set up your database query to display GeoJSON
let power_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM "+
"(SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((lg.id, name,country_name,status,description)) As properties "+
"FROM power_plants As lg,countries,status_type,reactor_type where countries.code=country_code and status_id=status_type.code and reactor_type.id=reactor_type_id) As f) As fc";

module.exports = router;
/* GET home page. */
router.get('/', function(req, res) {
    /*res.render('index', {
        title: 'Express'
    });*/
    let client = new pg.Client(conString);
    client.connect();
    let query = client.query(power_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    let data,data2,data3,data4;
    query.on("end", function (result) {
         data = result.rows[0].row_to_json
    
    });
    let query2 = client.query("SELECT distinct country_code,country_name FROM power_plants,countries where countries.code=country_code order by country_name");
    query2.on("row", function (row, result) {
        result.addRow(row);
    });
    query2.on("end", function (result) {
        data2 = result.rows
       
    });
    let query3 = client.query("SELECT distinct status_id,status FROM power_plants,status_type where status_id=status_type.code order by status_id");
    query3.on("row", function (row, result) {
        result.addRow(row);
    });
    query3.on("end", function (result) {
        data3 = result.rows
        
    });
    let query4 = client.query("SELECT distinct reactor_type_id,description FROM power_plants,reactor_type where reactor_type.id=reactor_type_id order by reactor_type_id");
    query4.on("row", function (row, result) {
        result.addRow(row);
    });
    query4.on("end", function (result) {
        data4 = result.rows
        
        res.render('index', {
            title: "Express API",
            jsonData: data,
            countries: data2,
            status:data3,
            reactors:data4,
            selectedCountries:data2,
            selectedStatus:data3,
            selectedReactors:data4,
        });
    });
});


router.get('/about', function(req, res) {
    res.render('about', {
        title: "About",
       
    });
});




/* GET the filtered page */
router.get('/search*', function (req, res) {

    let filter_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM "+
"(SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((lg.id, name,country_name,status,description)) As properties "+
"FROM power_plants As lg,countries,status_type,reactor_type where countries.code=country_code and status_id=status_type.code and reactor_type.id=reactor_type_id";
    if( req.query.countries)
        {
            if (typeof req.query.countries == "string")
                filter_query+=" and ( country_code='"+req.query.countries+"')";
            else
                for (let index = 0; index < req.query.countries.length; index++) {
                    if(index==0)
                        filter_query+=" and ( country_code='"+req.query.countries[index]+"'"
                    else
                        filter_query+=" or country_code='"+req.query.countries[index]+"'"
                    if(index==req.query.countries.length-1)
                        filter_query+=" )"
                }
        }
    
    if( req.query.status)
        for (let index = 0; index < req.query.status.length; index++) {
            if(index==0)
                filter_query+=" and ( status_id="+req.query.status[index]
            else
                filter_query+=" or status_id="+req.query.status[index]
            if(index==req.query.status.length-1)
                filter_query+=" )"
        }
    if( req.query.reactors)
    
        for (let index = 0; index < req.query.reactors.length; index++) {
            if(index==0)
                filter_query+=" and ( reactor_type_id="+req.query.reactors[index]
            else
                filter_query+=" or reactor_type_id="+req.query.reactors[index]
            if(index==req.query.reactors.length-1)
                filter_query+=" )"
        }
    filter_query+=") As f) As fc";

    console.log(filter_query);
    console.log(req.query.countries)

    let client = new pg.Client(conString);
    client.connect();
    let query = client.query(filter_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    let data,data2,data3,data4;
    query.on("end", function (result) {
         data = result.rows[0].row_to_json
    
    });
    let query2 = client.query("SELECT distinct country_code,country_name FROM power_plants,countries where countries.code=country_code order by country_name");
    query2.on("row", function (row, result) {
        result.addRow(row);
    });
    query2.on("end", function (result) {
        data2 = result.rows
       
    });
    let query3 = client.query("SELECT distinct status_id,status FROM power_plants,status_type where status_id=status_type.code order by status_id");
    query3.on("row", function (row, result) {
        result.addRow(row);
    });
    query3.on("end", function (result) {
        data3 = result.rows
        
    });
    let query4 = client.query("SELECT distinct reactor_type_id,description FROM power_plants,reactor_type where reactor_type.id=reactor_type_id order by reactor_type_id");
    query4.on("row", function (row, result) {
        result.addRow(row);
    });
    query4.on("end", function (result) {
        data4 = result.rows
        let selectedCountries,selectedStatus,selectedReactors
        if (!req.query.countries)
            selectedCountries=data2
        else 
            selectedCountries=req.query.countries
        if (!req.query.status)
            selectedStatus=data3
        else 
            selectedStatus=req.query.status
        if (!req.query.reactors)
            selectedReactors=data4
        else 
            selectedReactors=req.query.reactors
        res.render('index', {
            title: "Express API",
            jsonData: data,
            countries: data2,
            status:data3,
            reactors:data4,
            selectedCountries,
            selectedStatus,
            selectedReactors

        });
    });
});


