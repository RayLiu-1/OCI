var express = require('express');
var router = express.Router();
var db = require('../database')

const sql = `SELECT DISTINCT talent_id, Talent_Name, Email,T.Seniority,T.TechStack ,T.IOM ,T.Email ,T.LinkedInURL , T.Location, JobURL, [Job Name], Company
FROM jd as J
INNER JOIN talent as T
ON T.Location = J.Location
and T.Seniority = J.Seniority
and T.TechStack = J.TechStack
and T.IOM = J.IOM
`

router.get('/', function(req, res, next) {
    let data = []
    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        data = rows
        res.send(JSON.stringify(data))
      });
  });
  
  module.exports = router;