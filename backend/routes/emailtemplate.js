var express = require('express');
var router = express.Router();
var db = require('../database')

const sql = `SELECT * FROM emailtemplate`

router.get('/', function(req, res, next) {
    db.get('SELECT * FROM emailtemplate',[],(err, row) => {
        if(err) {
            throw err;
        }
        res.send(JSON.stringify(row))
    })
   
});
  

router.put('/', function(req, res, next) {
    db.serialize(() => {
        db.run('DELETE FROM emailtemplate')
        db.run(
            `INSERT INTO emailtemplate (subject, emailtemplate)
            VALUES ('${req.body.subject}','${req.body.emailtemplate}')
            `, [],
            (err) => {
                if(err) {
                    throw err;
                }
            })
        
        res.send(`INSERT INTO emailtemplate (subject, emailtemplate)
        VALUES ('${req.body.subject}','${req.body.emailtemplate}')
        `)

    })
   
});
  
module.exports = router;
  