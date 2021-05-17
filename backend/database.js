var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

const EMAILTEMPLATE = "{\"ops\":[{\"insert\":\"Hi [ First Name ],\\n\\nThis is Kirby who has connected with you on LinkedIn several days ago. I would like to share the open opportunities that could be a good match for you. Meanwhile, I’d love to send the job openings that could be a good fit along with our insights to you every week. Hope the information could help you more with your career choice. \\n1. [Job Name]  [Company]  [Location]   [URL]\\n2. [Job Name]  [Company]  [Location]   [URL]\\n3. [Job Name]  [Company]  [Location]   [URL]\\n4. [Job Name]  [Company]  [Location]   [URL]\\n5. [Job Name]  [Company]  [Location]   [URL]\\n\"}]}"
const EMAILSUBJECT = "Greeting"

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS talent (
            talent_id INTEGER PRIMARY KEY,
            "Talent_Name" TEXT,
            "Location" TEXT,
            "Seniority" TEXT,
            "TechStack" TEXT,
            "IOM" TEXT,
            "Email" TEXT,
            "LinkedInURL" TEXT
          )`,
            
        (err) => {
            if (err) {
                console.error(err.message)
                throw err
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS jd (
            jd_id INTEGER PRIMARY KEY,
            "Job Name" TEXT,
            "Location" TEXT,
            "Company" TEXT,
            "TechStack" TEXT,
            "Seniority" TEXT,
            "IOM" TEXT,
            "JobURL" TEXT
          )`,
            
        (err) => {
            if (err) {
                console.error(err.message)
                throw err
            }
        });
        db.serialize( () => {
            db.run(`CREATE TABLE IF NOT EXISTS emailtemplate (
                template_id INTEGER PRIMARY KEY,
                subject TEXT,
                emailtemplate TEXT)`,
                (err) => {
                    if (err) {
                        console.error(err.message)
                        throw err
                    }
                });
                
            db.run(
                `INSERT INTO emailtemplate (subject, emailtemplate)
                SELECT '${EMAILSUBJECT}','${EMAILTEMPLATE}'
                WHERE NOT EXISTS (SELECT subject, emailtemplate FROM emailtemplate)`,  
                (err) => {
                    if (err) {
                        console.error(err.message)
                        throw err
                    }
                })
        })
        
    }
});




module.exports = db