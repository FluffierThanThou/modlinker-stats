const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // get top 10 lists for mods, authors and requesters.
    // console.log( req.db )
    Promise.all([
        req.db.topMods( 500 ),
        req.db.topAuthors( 500 ),
        req.db.topRequesters( 500 )
    ]).then( docs => res.render( "top", { mods: docs[0], authors: docs[1], requesters: docs[2] } ) )
      .catch( err => res.render( "error", {error: err} ) )
});

module.exports = router;
