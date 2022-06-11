const express = require('express');
const session = require('express-session');
const Redis = require('ioredis');
const app = express();
const bodyParser = require('body-parser');
const mainRoute = require('./controllers/routes/route-controller')
const memberApi = require('./controllers/routes/member-route');
const generallyApi = require('./controllers/routes/api-route');
const landlordApi = require('./controllers/routes/landlord-api');
const tenantApi = require('./controllers/routes/tenant-api');
const RedisStore = require('connect-redis')(session);
const redisClient = new Redis({host:'redis'});
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
app.use('/landlordApi',landlordApi);
app.use('/tenantApi',tenantApi);


app.get('/',mainRoute.indexView)

app.get('/search',mainRoute.searchView)

app.get('/houseinfo/:houseId',mainRoute.houseInfoView)

app.get('/signin',mainRoute.signinView)

app.get('/registerch',mainRoute.chooseRegisterView)

app.get('/registerch/landlord',mainRoute.registerLandlordView)

app.get('/registerch/tenant',mainRoute.registerTenantView)

app.get('/landlordmember',mainRoute.landlordPageView)

app.get('/landlordmember/addhouse',mainRoute.addHouseView)

app.get('/landlordmember/reserve',mainRoute.landlordReserveView)

app.get('/landlordmember/pay/:houseId',mainRoute.landlordPayList)

app.get('/landlordmember/pay/:houseId/addbill',mainRoute.landlordAddBill)

app.get('/tenantmember',mainRoute.tenantPageView)

app.get('/tenantmember/pay/:houseId',mainRoute.tenantPaylist)

app.get('/tenantmember/pay/:houseId/:billId',mainRoute.payPageView)

app.get('/landlordmember/pay/:houseId/fixbill/:billId',mainRoute.fixBillPageView)

app.get('/landlordmember/fixhouse/:houseId',mainRoute.fixHouseView)


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