const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var router = express.Router();
const client = require(path.join(__dirname, '/../dbs/db.js'));
const routMod = require(__dirname + '/routerModules/routerModule.js');
const uri = "mongodb+srv://yoannmroz:ChristopheMonGodetBLOL@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';
const ObjectId = require('mongodb').ObjectID;

const store = new MongoDBStore({
	uri: uri,
	databaseName: 'twoPrisoners',
	collection: 'sessions'
});
  store.on('error', function(error) {
	console.log(error);
});

const getRandomID = () => {
	let ID = '';
	for (var i = 0; i < 9; i++) {
		ID += Math.floor(Math.random() * Math.floor(10));
	}
	return ID
}

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
    res.sendFile(path.join(__dirname, '../../build/index.html'));
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

	// get user's data
	if (req.body.request && req.body.request === 'getUser') {
		let connected = false;
		if (req.session && req.session.user) {
			connected = true;
		}
		data = { profil: routMod.getUserName(req), title: 'index', message: routMod.getUserName(req), avatar: getAvatar(req), connected: connected, notifNumber: req.session.notifNumber,  };
		res.json(data)
	}

	// Like a news
	if (req.body.request && req.body.request === 'likeNews' && req.session && req.session.user) {
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('articles');
			collection.find({"_id": ObjectId(req.body.news._id)}).toArray(function(err, data){
			    if (err) throw err;
			    if (data[0] !== undefined){
			        console.log('Request like detected to article wich id is : ' + req.body.news._id);
			        let articleNotLikedYet = false;
			        for (var i = 0; i < data[0].likes.length; i++) {
			        	if (data[0].likes[i] === req.session.user) {
			        		articleNotLikedYet = true;
			        		data[0].likes.splice(i, 1);
			        		i = data[0].likes.length;
			        	}
			        }
			        if (articleNotLikedYet === false) {
			        	data[0].likes.push(req.session.user)
			        }
			        collection.updateOne(
			            {"_id": ObjectId(req.body.news._id)},
			            { $set: { likes: data[0].likes } }, function(err,records){
			            	console.log('Likes updated');
			        	}
			        );
			        res.json(data[0]);
			        client.close();
			    }
			});
		});
	}

	// Like a comment
	if (req.body.request && req.body.request === 'likeComment' && req.session && req.session.user) {
		let comment = req.body.comment;
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('articles');
			let commentNotLikedYet = false;
	        for (var j = 0; j < comment.likes.length; j++) {
	        	if (comment.likes[j] === req.session.user) {
	        		commentNotLikedYet = true;
	        		comment.likes.splice(j, 1);
	        		j = comment.likes.length;
	        	}
	        }
	        if (commentNotLikedYet === false) {
	        	comment.likes.push(req.session.user)
	        }
			collection.updateOne(
			  { 
			    "_id" : ObjectId(req.body.news._id), 
			    "comments.id" : comment.id},
			  { 
			    $set : { "comments.$.likes" : comment.likes } 
			  }, function(err,records){
			  		if (err) throw err;
			       	collection.find({"_id": ObjectId(req.body.news._id)}).toArray(function(err, data){
						if (err) throw err;
						if (data[0] !== undefined){
					        res.json(data[0]);
					        client.close();
					    }
					});
			    }
			);
		});
	}

	// Add comment
	if (req.body.request && req.body.request === 'addComment' && req.session && req.session.user) {
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('articles');
			collection.find({"_id": ObjectId(req.body.news._id)}).toArray(function(err, data){
			    if (err) throw err;
			    if (data[0] !== undefined){
			    	let newComment = {
			    		author: req.session.user,
			    		content: req.body.comment,
			    		date: Date.now(),
			    		id: getRandomID(),
			    		likes: [],
			    		lastModifyDate: 0,
			    		modifyNumber: 0
			    	}
			        data[0].comments.push(newComment)

			        collection.updateOne(
			            {"_id": ObjectId(req.body.news._id)},
			            { $set: { comments: data[0].comments } }, function(err,records){
			            	console.log('comments updated');
			        	}
			        );
			        res.json(data[0]);
			        client.close();
			    }
			});
		});
	}

	// Add News
	if (req.body.request && req.body.request === 'addNews' && req.session && req.session.user) {
		if (req.body.news && req.body.news.title && req.body.news.content) {
			title = req.body.news.title;
			content = req.body.news.content;

			let newArticle = {
				author: req.session.user,
				date: Date.now(),
				title: title,
				content: content,
				likes: [],
				lastModifyDate: null,
				modifyNumber: 0,
				comments: []
			}

			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('articles');
				collection.insertOne(newArticle);
			});

			res.json(newArticle);
			client.close();
		}
	}

	// Delete a news
	if (req.body.request && req.body.request === 'deleteNews' && req.session && req.session.user) {
		let comment = req.body.comment;
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('articles');
		   	collection.remove( { "_id" : ObjectId(req.body.news._id) }, function(err, result) {
	            if (err) {
	                console.log(err);
	            }
				res.json('delete OK');
				client.close();
	        });
		});
	}

	// 'Delete' a comment
	if (req.body.request && req.body.request === 'deleteComment' && req.session && req.session.user) {
		let comment = req.body.comment;
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('articles');
			collection.updateOne(
			  { 
			    "_id" : ObjectId(req.body.news._id), 
			    "comments.id" : comment.id},
			  { 
			    $set : { "comments.$.deleted" : true } 
			  }, function(err,records){
			  		if (err) throw err;
			       	collection.find({"_id": ObjectId(req.body.news._id)}).toArray(function(err, data){
						if (err) throw err;
						if (data[0] !== undefined){
					        res.json(data[0]);
					        client.close();
					    }
					});
			    }
			);
		});
	}
});

module.exports = router;

