var express = require("express");


var app = express();

app.get("/", function(req, res){
    res.send("UploadServer!");
});

app.listen(11000, function(){
    console.log("Server running on 11000");
});