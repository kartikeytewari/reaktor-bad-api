const express=require("express");
const body_parser=require("body-parser");
const request=require("request");
const app=express();
app.set("view engine","ejs");
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
localStorage.clear();

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
            let product_data=JSON.parse(body);
            let manufacturer_all_data={};

            let get_manufacturer_data = function(x)
            {
                console.log(x + "function called")
                if (x===product_data.length)
                {
                    // render page
                    console.log("render called")
                    localStorage.setItem('manufacturer_all_data', manufacturer_all_data.data.data);
                    res.render("product_page",{product_data:product_data, manufacturer_all_data: manufacturer_all_data});
                }
                else if (x<=product_data.length-1)
                {
                    // get this data and call next function
                    let manufacturer_name=product_data[x]["manufacturer"];
                    if (!((manufacturer_name in manufacturer_all_data)&&(manufacturer_all_data[manufacturer_name]["response"].length!=0)))
                    {
                        let manufacturer_url="https://bad-api-assignment.reaktor.com/v2/availability/" + manufacturer_name
                        console.log("manufacturer url requested: at " + manufacturer_url);
                        request(manufacturer_url,function(error,response,second_data_body)
                        {
                            if (error)
                            {
                                console.log("error encountered");
                                res.send("we enountered error");
                            }
                            else if (response.statusCode!=200)
                            {
                                console.error("not ok response status encountered");
                                res.send("something went wrong from our side")
                            }
                            else
                            {
                                console.log("success route requested to: " + manufacturer_url)
                                manufacturer_all_data[manufacturer_name] = JSON.parse(second_data_body);
                                get_manufacturer_data(x+1);
                            }
                        })
                    }
                    else
                    {
                        get_manufacturer_data(x+1);
                    }
                }
            }

            manufacturer_all_data=localStorage.getItem('manufacturer_all_data');
            if (manufacturer_all_data)
            {
                console.log("render called")
                res.render("product_page",{product_data:product_data, manufacturer_all_data: manufacturer_all_data});
            }
            else
            {
                manufacturer_all_data={};
                get_manufacturer_data(0);
            }
        }
    })
})
