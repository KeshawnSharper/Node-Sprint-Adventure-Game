var express = require('express');
var app = express();
app.set('view engine', 'ejs')
app.get('/:name', function(req, res) {
res.render('pages/index',{name:req.params.name});
});
app.get('/Location/:location', function(req, res) {
res.render('pages/location',{location:req.params.location});
});
app.get('/Area/:area', function(req, res) {
    res.render('pages/area',{area:req.params.area});
    });
  app.listen(process.env.PORT || 8080);
console.log('Server is listening on port 8080');