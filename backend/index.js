const express = require('express');
 const app = express();

 const db = require('./models');

 const cors = require('cors');
 app.use(cors());
 app.use(express.json());
 
 const linkRouter = require('./routes/Links')
 app.use("/links", linkRouter);   

db.sequelize.sync().then(()=>{
    app.listen(3307, () => {
        console.log("server running");
    })
 })



 