const MongoClient = require('mongodb').MongoClient
const mongo_uri = process.env['MONGO_URI'].replace( /(^"|"$)/g, "" )

function DB() {
    this.db = null;
}

DB.prototype.connect = function( callback ){
    // connection already established
    if (this.db)
        return callback()

    // create connection
    MongoClient.connect( mongo_uri, (err, database) => {
        if (err) {
          console.error( "Database connection failed" )
          console.error( JSON.stringify( err, null, 4 ) );
          process.exit( 1 );
        } 
        console.log( "Database connected" );
        this.db = database;
        callback();
    })
}

DB.prototype.topMods = function( limit = 10 ){
    return this.db.collection( "requests_collection" ).aggregate([
        {
            $group: {
              _id: "$mod.title",
              count: { $sum: 1 },
              url: { $first: "$mod.url" },
              author: { $first: "$mod.author" },
            }
        }, 
        { 
           $sort: { count: -1 }
        },
        {
            $limit: limit
        }
    ]).toArray()
}

DB.prototype.topAuthors = function( limit = 10){
    return this.db.collection( "requests_collection" ).aggregate([
        {
            $group: {
              _id: "$mod.author",
              count: { $sum: 1 },
              url: { $first: "$mod.authorUrl" },
            }
        }, 
        { 
           $sort: { count: -1 }
        },
        {
            $limit: limit
        }
    ]).toArray()
}

DB.prototype.topRequesters = function( limit = 10 ){
    return this.db.collection( "requests_collection" ).aggregate([
        {
            $group: {
              _id: "$requestingRedditor",
              count: { $sum: 1 }
            }
        }, 
        { 
           $sort: { count: -1 }
        },
        {
            $limit: limit
        }
    ]).toArray()
}

module.exports = DB;