const express=require("express");
const body_parser=require("body-parser");
const request=require("request");
const app=express();
app.set("view engine","ejs");
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));


var port=process.env.PORT || 8173
app.listen(port,function(){
    console.log("The server have started at port " + port);
})

app.get("/",function(req,res){
    console.log("sucess: route requested to '/'")
    res.render("home");
})

app.get("/product/:product", function(req,res){
    let url="https://bad-api-assignment.reaktor.com/v2/products/" + req.params.product
    console.log("requested url: " + url);
    request(url,function(error,response,body){
        if (error)
        {
            console.error("error from /" +  req.params.product + "route");
            res.send("we encountered error");
        }
        else if (response.statusCode!==200)
        {
            console.error("'not ok' response status code from route /" + req.params.product);
            res.send("we encountered some error response.statusCode " + response.statusCode);
        }
        else
        {
            console.log("sucess: route requested to /" + req.params.product);
            let data=JSON.parse(body);
            res.render("product_page",{data:data});
        }
    })
})
