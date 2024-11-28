const express = require("express");
const router = express.Router();
const db = require("../dbconn");


router.post("/features",(req,res)=>{
          console.log("ciw");
          console.log(req.body.roomID);
});

module.exports = router;