const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var router = express.Router();
const client = require(path.join(__dirname, '/../dbs/db.js'));
const routMod = require(__dirname + '/routerModules/routerModule.js');
const uri = "mongodb+srv://yoannmroz:ChristopheMonGodetBLOL@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';

const store = new MongoDBStore({
	uri: uri,
	databaseName: 'twoPrisoners',
	collection: 'sessions'
});
  store.on('error', function(error) {
	console.log(error);
});

const getAvatar = function (req) {
	if (req.session && req.session.avatar) {
		return req.session.avatar
	} else {
		return '/images/usersAvatars/placeholderAvatar.png'
	}
}

router.use(session({
	secret: secret,
	store: store,
	saveUninitialized : true,
	resave: false
}));

router.get('/', function(req, res) {
	let connected = false;
	if (req.session && req.session.user) {
		connected = true;
	}
    res.sendFile(path.join(__dirname, '../../build/index.html'));
    res.locals.data = { profil: routMod.getUserName(req), title: 'index', message: routMod.getUserName(req), avatar: getAvatar(req), connected: connected };
});

router.post('/', function(req, res) {
	// get news to populate "News" section, requested when componentDidMount
	if (req.body.request && req.body.request === 'getNews') {
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('articles');
			collection.find().sort({date: 1}).toArray(function(err, data){
				if (data) {
					res.json(data);
				}
				client.close();
			});
		});
	}
});

module.exports = router;