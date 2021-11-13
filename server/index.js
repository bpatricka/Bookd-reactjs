const { Connection, Request } = require("tedious");
const { BlobServiceClient, StorageSharedKeyCredential  } = require("@azure/storage-blob");
const express = require("express");
const cors = require("cors");
const port = 5000;
require("dotenv").config();
const sql = require("mssql");


/////////// init
const app = express();
const bodyParser = require('body-parser');
const { response, request } = require("express");

let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('public'));


app.use(express.json());
app.use(cors());
console.log(process.env);

// Enter your storage account name and shared key
const account = process.env.ACCOUNT_NAME;
const accountKey = process.env.ACCOUNT_KEY;


// TODO store these secure variables away
const config = {
  user: process.env.SQL_DB,
  password: process.env.PASSWD,
  server: process.env.REACT_APP_DB_SN,
  database: process.env.REACT_APP_SQL_DB,
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


// GET ALL MEDIA
app.get('/media', (req,res) => {
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
          return res.send(recordset.recordsets[0]);
        });
    });
  }

});

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
          const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
          const downloadBlockBlobResponse = await blockBlobClient.download(0);
          const downloaded = streamToBuffer(downloadBlockBlobResponse.readableStreamBody).toString();
          console.log("Downloaded blob content:", downloaded);

          
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
          
          listC().catch((err) => {
            console.error("Error running sample:", err.message);
          });
          
        }
      }
    }
  }
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