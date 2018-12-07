const express           = require('express');

let secrets;
if (process.env.NODE_ENV === 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}


const app = express();
app.use(express.static('public'));

app.get('/popular.json', (req, res) => {
    console.log("testing");
});


app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');

});

app.listen(process.env.PORT || 3000, () => console.log("Tables"));
