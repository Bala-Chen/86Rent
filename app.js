const express = require('express');
const session = require('express-session');
const Redis = require('ioredis');
const app = express();
const bodyParser = require('body-parser');
const mainRoute = require('./controllers/routes/route-controller')
const memberApi = require('./controllers/routes/member-route');
const generallyApi = require('./controllers/routes/api-route');
const londloadApi = require('./controllers/routes/londload-api');
const tanantApi = require('./controllers/routes/tanant-api');
const RedisStore = require('connect-redis')(session);
const redisClient = new Redis();  //{host:'redis'}
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const options = {
    swaggerDefinition: swaggerDocument,
    apis: ['./controllers/routes/*.js']
  };
const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    name:'session',
    secret:'keyboard cat',
    saveUninitialized:false,
    resave:false,
    store: new RedisStore({client:redisClient})
}));
app.use('/api/member',memberApi);
app.use('/api',generallyApi);
app.use('/londloadApi',londloadApi);
app.use('/tanantApi',tanantApi);


app.get('/',mainRoute.indexView)

app.get('/search',mainRoute.searchView)

app.get('/houseinfo/:houseId',mainRoute.houseInfoView)

app.get('/signin',mainRoute.signinView)

app.get('/registerch',mainRoute.chooseRegisterView)

app.get('/registerch/londload',mainRoute.registerLondloadView)

app.get('/registerch/tanant',mainRoute.registerTanantView)

app.get('/londloadmember',mainRoute.londloadPageView)

app.get('/londloadmember/addhouse',mainRoute.addHouseView)

app.get('/londloadmember/reserve',mainRoute.londloadReserveView)

app.get('/londloadmember/pay/:houseId',mainRoute.londloadPayList)

app.get('/londloadmember/pay/:houseId/addbill',mainRoute.londloadAddBill)

app.get('/tanantmember',mainRoute.tanantPageView)

app.get('/tanantmember/pay/:houseId',mainRoute.tanantPaylist)

app.get('/tanantmember/pay/:houseId/:billId',mainRoute.payPageView)

app.get('/londloadmember/pay/:houseId/fixbill/:billId',mainRoute.fixBillPageView)

app.get('/londloadmember/fixhouse/:houseId',mainRoute.fixHouseView)


app.use(function(req, res, next) {
    res.status(404).render('error404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3500,()=>{
    console.log('server is listening on port 3500..')
})