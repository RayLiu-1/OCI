var express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
var router = express.Router();
var db = require('../database')

const upload = multer()
const TALENTCOLUMNS = ["Job Name", "Location" , "Company","TechStack", "Seniority"  ,"IOM" ,"JobURL" ]

router.put('/', upload.single('file'), async function(req, res, next) {
  // const workBook = new ExcelJS.Workbook();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer);
  let worksheet = null
  if(workbook.worksheets.length > 1)
    worksheet = workbook.worksheets.find(sheet => sheet.name == 'JD Dataset')
  else if(workbook.worksheets.length == 0)
    worksheet = workbook.worksheets[0]
  let headerDict = {}
    
  if (worksheet && worksheet.getRow(1)) {
    headers = worksheet.getRow(1).values
    headers.forEach((elem, idx) => {
      headerDict[elem] = idx
    })
  }
  
  let queryStr = `INSERT INTO jd (${TALENTCOLUMNS.map(col => `"${col}"`).join(", ")})
VALUES`
    
  worksheet.eachRow(function(row, rowNumber) {
    if (rowNumber == 1)
      return
    queryStr += `
    (${TALENTCOLUMNS.map(col => {
          cellValue = row.values[headerDict[col]]
          if(row.getCell(headerDict[col]).type == ExcelJS.ValueType.Hyperlink) {
            return `'${cellValue.text}'`
          }
    return `'${cellValue}'`
    }).join(", ")}),`
  });
  
  queryStr = queryStr.substr(0, queryStr.length - 1) + ';';
  db.serialize(function() {
    db.run("DELETE FROM jd")

    db.run(queryStr)
  })
  res.send('respond with a resource');
});

module.exports = router;
