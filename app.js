const { response } = require('express');
const express = require('express');
const port = 3000;
const https = require('https');



const app = express();
app.use(express.static('public')); // create a static directory for style and js files

// POST route
app.use(express.json()); // when parsing data that comes in HTML form -- used to parse JSON bodies
app.use(express.urlencoded({ extended:true })); //allows you to post nested objects, go into any route and can tap into req.body
 
app.get('/', function(req, res) {

    // res.sendFile allows you to send a specific file (html)
    res.sendFile(__dirname + "/signup.html"); // directs it to the signup page, __dirname is directory name

    // home route post request
    // log the data the user entered into the input || need 
    app.post('/', function(req, res) {
        // const apiKey = "8487c24456551c28a00e619eeb496d0c-us17"
        // const listId = "d794d1fabf";
        const firstName = req.body.userFirstName;
        const lastName = req.body.userLastName;
        const email = req.body.userEmail;
        
        // data sent via body parameters using a key called members
        const data = { // create the data we want to return
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                },
            ]
        }

        // ready to send data, next is to create the request
        const jsonData = JSON .stringify(data); // turn data into JSON by stringifying it

        const url = "https://us17.api.mailchimp.com/3.0/lists/d794d1fabf";

        const options = {
            method: "POST",
            auth: "eugene1:8487c24456551c28a00e619eeb496d0c-us17"
        }

        // check what data is sent from the server
        const request = https.request(url, options, function(response) {
           if (response.statusCode === 200) {
               res.sendFile(__dirname + "/success.html")
           } else {
               res.sendFile(__dirname + "/failure.html")
           }
           
            response.on('data', function(data) {
                console.log(JSON.parse(data));
            })
        })

        request.write(jsonData);
        request.end();
    })

    app.post('/failure', function(req, res) {
        res.redirect('/')
    })

})

app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on port ' + port);
})
