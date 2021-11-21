const { Connection, Request } = require("tedious");
const { BlobServiceClient, StorageSharedKeyCredential  } = require("@azure/storage-blob");
const express = require("express");
const cors = require("cors");
const port = 5000;
const sql = require("mssql");
// const multer = require('multer');
// const formidable = require('express-formidable');
// const upload = multer({dest: 'uploads/'});
const fileUpload = require('express-fileupload');
const { v1: uuidv1} = require('uuid');

require('dotenv').config({path:'../.env'})
/////////// init
const app = express();
const bodyParser = require('body-parser');
const { response, request } = require("express");

let urlencodedParser = bodyParser.urlencoded({ extended: false });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());
// app.use(formidable());
// app.use(upload.array());
app.use(express.static('public'));

app.use(express.json());
app.use(cors());

const account = process.env.AACCOUNT_NAME;
const accountKey = process.env.ACCOUNT_KEY;

const config = {
  user: process.env.DBUSERNAME,
  password: process.env.PASSWD,
  server: process.env.DB_SN,
  database: process.env.SQL_DB,
  encrypt: true
}


/**
 * 
 * 
 * 
 * SERVER START
 * 
 * 
 */

//profile information
app.get('/prof/:email', (req,res)=>{
    email = req.params.email;
    // connect using config
    sql.connect(config, function (err) {
      if (err) {console.log(err);}

      const request = new sql.Request();
      
      // GET all prev rentals from that user
      request.query(
        "SELECT * FROM [dbo].[rentals] r JOIN [dbo].[media] m on r.media_id = m.media_id WHERE r.checked_in = 1 AND r.email='"+email+"'",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.recordsets[0].length == 0){
            console.log('no data');
            return res.send('0');
          }
          return res.send(recordset.recordsets[0]);
        })
    });
});


// GET ALL MEDIA
app.get('/media', (req,res) => {
  // connect using config
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      "SELECT * FROM [dbo].[media] m JOIN [dbo].[courses] c on m.course_id = c.course_id JOIN [dbo].[professors] p on p.prof_id = m.prof_id JOIN [dbo].[departments] d on d.dept_id = m.dept_id",
      function (err, recordset) {
        if (err) console.log(err);
        return res.send(recordset.recordsets[0]);
      });
  });
});
// search criteria route
app.get('/media/:srch', (req,res) => {
  // get media from SQL DB
  getCurrentMedia();
  function getCurrentMedia() {
  
    // connect using config
    sql.connect(config, function (err) {
      if (err) {console.log(err);}
  
      const request = new sql.Request();
  
      request.query(
        "SELECT * FROM [dbo].[media] m JOIN [dbo].[courses] c on m.course_id = c.course_id JOIN [dbo].[professors] p on p.prof_id = m.prof_id JOIN [dbo].[departments] d on d.dept_id = m.dept_id",
        function (err, recordset) {
          if (err) console.log(err);
          // filter logic here using regexp
          const temp = [];
          let srch = req.params.srch.toLowerCase();
          let re = new RegExp(srch,"i");
          for (const item in recordset.recordsets[0]){
            for (const sitem in recordset.recordsets[0][item]){
              if (re.test(String(recordset.recordsets[0][item][sitem]).toLowerCase())){
                if (!recordset.recordsets[0][item].q){
                  recordset.recordsets[0][item].q = 1;
                  temp.push(recordset.recordsets[0][item]);
                }
              }
            }
          }
          return res.send(temp);
        });
    });
  }

});

// INSERT NEW RENTAL INTO DB
app.post('/media', urlencodedParser, (req, res)=>{
  const n_date = addMinutes(Date.now(),5);
  let temp = new Date();
  let response = {
    ...req.body,
    date_rented: formatDate(temp),
    date_returned: formatDate(n_date),
    checked_in: 0
  };

  let q = String("INSERT INTO [dbo].[rentals] VALUES ("+response.media_id+", '"+response.email+"', '"+response.date_rented+"', '"+response.date_returned+"', "+response.checked_in+")");

  // now logic for inserting rental into SQL DB
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        return res.send(recordset);
      }
    )
  });
});

// GET CURRENT MEDIA OF USER, NOT OVERDUE
app.get('/account/:email', (req, res)=>{
  // Create connection to database
  // using mssql
  let temp = new Date();
  temp = formatDate(temp);
  email = req.params.email;
    // connect using config
    sql.connect(config, function (err) {
      if (err) {console.log(err);}

      const request = new sql.Request();
      
      // GET current media that is not overdue
      request.query(
        "SELECT * FROM [dbo].[rentals] r JOIN [dbo].[media] m on r.media_id = m.media_id WHERE r.checked_in = 0 AND r.email='"+email+"' AND r.date_returned >= '"+temp+"'",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.recordsets[0].length == 0){
            console.log('no data');
            return '';
          }
          //adjusting output so join doesn't make two media-ids
          for (const item in recordset.recordsets[0]){
            recordset.recordsets[0][item].media_id = recordset.recordsets[0][item].media_id[0];
          }
          return res.send(recordset.recordsets[0]);
        })
    });
});

// UPDATE ALL OVERDUE 
app.post('/media/checkin', (req, res)=> {
  let temp = formatDate(new Date());
     // connect using config
     sql.connect(config, function (err) {
      if (err) {console.log(err);}
  
      const request = new sql.Request();
      
      // 
      request.query(
        "UPDATE [dbo].[rentals] SET checked_in = 1 WHERE date_returned < '"+temp+"' AND checked_in = 0",
        function (err, recordset) {
          if (err) console.log(err);
          return res.send(recordset);
        })
    });
});
// data retrieval from blob storage
app.get('/account/rental/:blob', (req, res)=>{
  // get media from blob storage
  // Use StorageSharedKeyCredential with storage account and account key
  // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );
  listC();
  async function listC(){
    //get containers
    let containers = blobServiceClient.listContainers();
    for await (const container of containers) { //iter
      const containerClient = blobServiceClient.getContainerClient(container.name);

      // get blobs
      let blobs = containerClient.listBlobsFlat();
      for await (const blob of blobs) { //iter
        if (blob.name == req.params.blob){ //match on user click
          console.log('found media');
          const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
          const downloadBlockBlobResponse = await blockBlobClient.download(0);
          // console.log('\nDownloaded blob content...');
          // console.log('\t', await streamToString(downloadBlockBlobResponse.readableStreamBody));
          res.send(await streamToBuffer(downloadBlockBlobResponse.readableStreamBody));

          
          // A helper method used to read a Node.js readable stream into a Buffer
          async function streamToBuffer(readableStream) {
            return new Promise((resolve, reject) => {
              const chunks = [];
              readableStream.on("data", (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
              });
              readableStream.on("end", () => {
                resolve(Buffer.concat(chunks));
              });
              readableStream.on("error", reject);
            });
          }

          // async function streamToString(readableStream) {
          //   return new Promise((resolve, reject) => {
          //     const chunks = [];
          //     readableStream.on("data", (data) => {
          //       chunks.push(data.toString());
          //     });
          //     readableStream.on("end", () => {
          //       resolve(chunks.join(""));
          //     });
          //     readableStream.on("error", reject);
          //   });
          // }
          
          listC().catch((err) => {
            console.error("Error running sample:", err.message);
          });
          
        }
      }
    }
  }
});


// INSERT NEW USER INTO THE DB
app.get('/newuser/:email', (req, res)=>{
  let temp = new Date();
  let tempList = [];
  console.log(req.params.email);
  let init_q = "SELECT * FROM [dbo].[users] u where u.email = '"+req.params.email+"'";
  let q = String("INSERT INTO [dbo].[users] VALUES ('"+(req.params.email).split('@')[0]+"', '"+req.params.email+"', 'user', '0', '0')");

  // now logic for inserting rental into SQL DB
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      init_q,
      function (err, recordset) {
        if (err) console.log(err);
        // if the user doesnt exist in our DB
        if (recordset.recordsets[0].length === 0 && req.params.email){
          checkReg();
        }
        else{
          console.log('User exists');
          res.send(recordset.recordsets[0][0]);
        }
      }
    );
  });

  function checkReg(){
    // now logic for inserting rental into SQL DB
    sql.connect(config, function (err) {
      if (err) {console.log(err);}

      const request = new sql.Request();

      request.query(
        q,
        function (err, recordset) {
          if (err) console.log(err);
          return res.send(recordset);
        }
      );
    });
  }
});

//formdata for management wrapper
app.get('/formdata', (req, res)=>{
  let temp = [];
  // connect using config
  q = "SELECT * FROM [dbo].[professors]";
  q1 = "SELECT * FROM [dbo].[courses]";
  q2 = "SELECT * FROM [dbo].[departments]";
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        temp.push(recordset.recordsets);
      });
  });

  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q1,
      function (err, recordset) {
        if (err) console.log(err);
        temp.push(recordset.recordsets);
      });
  });

  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q2,
      function (err, recordset) {
        if (err) console.log(err);
        temp.push(recordset.recordsets);
        res.send(temp);
      });
  });
});

//formdata for management wrapper
app.get('/formdata/prof', (req, res) => {
  q2 = "SELECT * FROM [dbo].[professors]";
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q2,
      function (err, recordset) {
        if (err) console.log(err);
        res.send(recordset.recordsets[0])
      });
  });
});

//formdata for management wrapper
app.get('/formdata/course', (req, res) => {
  q2 = "SELECT * FROM [dbo].[courses]";
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q2,
      function (err, recordset) {
        if (err) console.log(err);
        res.send(recordset.recordsets[0])
      });
  });
});

//formdata for management wrapper
app.get('/formdata/dept', (req, res) => {
  q2 = "SELECT * FROM [dbo].[departments]";
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q2,
      function (err, recordset) {
        if (err) console.log(err);
        res.send(recordset.recordsets[0])
      });
  });
});


//posting new media into the db
app.post('/newmedia', function (req, res){

  let temp = [];
  let q = String("INSERT INTO [dbo].[media] VALUES ('"+req.body.media_key+"', '"+req.body.title+"', '"+req.body.author+"', '"+req.body.category+"', '"+req.body.prof_id+"', '"+req.body.course_id+"', '"+req.body.dept_id+"', '"+req.body.copies+"', '"+req.body.description+"', '"+req.body.publisher+"', '"+req.body.publishedDate+"', '"+req.body.m_type+"')");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        console.log('Adding to SQL DB...');
        temp.push(recordset);
      });
  });

  // upload media to blob storage
  // Use StorageSharedKeyCredential with storage account and account key
  // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const containerName = uuidv1();

  console.log('\nCreating container...');
  console.log('\t'+containerName);

  const containerClient = blobServiceClient.getContainerClient(containerName);

  // create container
  const createContainerResponse = containerClient.create();
  console.log('Container created successfully.', createContainerResponse);

  const blobName = req.body.media_key;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log('\nUploading to Azure Blob Storage: ', blobName);

  //upload data
  const data = req.files.file.data;

  const uploadBlobResponse = blockBlobClient.upload(data, data.length);
  console.log('Blob successfully uploaded.', uploadBlobResponse);
  res.send(JSON.stringify(String('Confirmed')));

});

// GET ALL USERS
app.get('/users', (req, res)=>{
  // connect using config
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      "SELECT * FROM [dbo].[users]",
      function (err, recordset) {
        if (err) console.log(err);
        return res.send(recordset.recordsets[0]);
      });
  });
});

//media report for most popular rentals
app.get('/reports/media', (req, res)=>{
  // connect using config
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      "SELECT COUNT(r.rental_id) as rental_count, m.title FROM rentals r JOIN media m on r.media_id = m.media_id group by m.title order by rental_count DESC",
      function (err, recordset) {
        if (err) console.log(err);
        return res.send(recordset.recordsets[0]);
      });
  });
});

//media report for most popular rentals
app.get('/reports/users', (req, res)=>{
  // connect using config
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      "SELECT COUNT(r.rental_id) as rental_count, u.email FROM rentals r JOIN users u on r.email = u.email group by u.email order by rental_count DESC",
      function (err, recordset) {
        if (err) console.log(err);
        return res.send(recordset.recordsets[0]);
      });
  });
});

//posting for new professor
app.post('/newprof', (req, res) => {
  let q = String("INSERT INTO [dbo].[professors] VALUES ('"+req.body.fname+"', '"+req.body.lname+"', '"+req.body.dept+"')");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting for new course
app.post('/newcourse', (req, res) => {
  let q = String("INSERT INTO [dbo].[courses] VALUES ('"+req.body.coursename+"', '"+req.body.courseDept+"', '"+req.body.courseProf+"')");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting for new dept
app.post('/newdept', (req, res) => {
  
  let q = String("INSERT INTO [dbo].[departments] VALUES ('"+req.body.deptname+"')");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});

//posting to delete professor
app.post('/delete/prof/:id', (req, res) => {
  const q = String("DELETE FROM [dbo].[professors] WHERE prof_id ='"+req.params.id+"'");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting to delete course
app.post('/delete/course/:id', (req, res) => {
  const q = String("DELETE FROM [dbo].[courses] WHERE course_id ='"+req.params.id+"'");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting to delete dept
app.post('/delete/dept/:id', (req, res) => {
  const q = String("DELETE FROM [dbo].[departments] WHERE dept_id ='"+req.params.id+"'");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting to delete media
app.post('/delete/media/:mediakey', (req, res) => {
  const q = String("DELETE FROM [dbo].[media] WHERE media_key ='"+req.params.mediakey+"'");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});

//posting to edit professor
app.post('/edit/prof/:id', (req, res)=>{
  let q = String("UPDATE [dbo].[professors] SET fname = '"+req.body.fname+"', lname = '"+req.body.lname+"', dept_id ='"+req.body.dept+"' WHERE prof_id = '"+req.params.id+"'");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting to edit dept
app.post('/edit/dept/:id', (req, res)=>{
  let q = String("UPDATE [dbo].[departments] SET dept_name = '"+req.body.name+"' WHERE dept_id = "+req.params.id);
  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting to edit course
app.post('/edit/course/:id', (req, res)=>{
  let q = String("UPDATE [dbo].[courses] SET course_name = '"+req.body.name+"', dept_id = '"+req.body.dept+"', prof_id ='"+req.body.prof+"' WHERE course_id = '"+req.params.id+"'");

  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});
//posting to edit professor
app.post('/editmedia/:mediakey', (req, res) => {
  
  const q = String("UPDATE [dbo].[media] SET title = '"+req.body.title+"', author = '"+req.body.author+"', category = '"+req.body.category+"', prof_id ='"+req.body.prof_id+"', course_id='"+req.body.course_id+"', dept_id='"+req.body.dept_id+"', copies='"+req.body.copies+"', description='"+String(req.body.description)+"', publisher='"+req.body.publisher+"', publishedDate='"+req.body.publishDate+"', m_type='"+req.body.m_type+"' WHERE media_key ='"+req.params.mediakey+"'");
  console.log(q);
  //enter media into sql
  sql.connect(config, function (err) {
    if (err) {console.log(err);}

    const request = new sql.Request();

    request.query(
      q,
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected.length === 1){
          console.log('Adding to SQL DB...');
          res.send(JSON.stringify(String('Confirmed')));
        } else {
          res.send(JSON.stringify(String('Failed')));
        }
      });
  });
});



// HELPER FUNCTIONS FOR FORMATTING TO MSSQL
function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result
}

function addMinutes(date, minutes) {
  let result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result
}

function addHours(date, hours) {
  let result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result
}

// date formatting for mssql format
function formatDate(date){
  let df = "YYYY-MM-DD hh:mm:ss.mmm";

  df = df.replace("DD", date.getDate());
  df = df.replace("MM", date.getMonth()+1);
  df = df.replace("YYYY", date.getFullYear());
  df = df.replace("hh", date.getHours());
  df = df.replace("mm", date.getMinutes());
  df = df.replace("ss", date.getSeconds());
  df = df.replace("mmm", date.getMilliseconds());
  return df;
}




app.listen(port, () => {
  console.log(`Server listening at Port: ${port}`)
});