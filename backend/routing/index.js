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

let connectedPlayerList = [];

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

	// Buy level up potion
	if (req.session && req.session.user && req.body.request && req.body.request === 'buyLevelUpPotion') {
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('users');

			collection.update(
			   { 'name': req.session.user },
			   { $inc: { gold: -500, level: 1 } }
			, function(err,records){
			  		if (err) throw err;
			  		res.json('OK');
		    		client.close();
			    }
			);
		});
	}

	// Activate account
	if (req.body.request && req.body.request === 'accountActivation' && req.body.code) {
		let code = req.body.code;
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('users');

			collection.find({"accountCodeActivation": code}).toArray(function(err, data){
				if (err) throw err;
				if (data[0] !== undefined){
			        if(!data[0].accountActivated) {
			        	collection.updateOne(
				            {"accountCodeActivation": code},
				            { $set: { "accountActivated" : true }
				        }, function(err,records){
						  		if (err) throw err;
						  		res.json('account_activated');
						  		req.session.user = data[0].name;
								req.session.avatar = data[0].avatar;
								req.session.requestYouForFriend = data[0].requestYouForFriend;
								req.session.recommendedFriends = data[0].recommendedFriends;
								req.session.notifNumber = data[0].requestYouForFriend.length + data[0].recommendedFriends.length;
					    		client.close();
						    }
						);
			        } else {
			        	res.json('already_activated');
					    client.close();
			        }
			    } else {
		        	res.json('account_unknow');
				    client.close();
		        }
			});
		});
	}

	// get news and users to populate "News" and "Players" section
	if (req.body.request && req.body.request === 'getNewsAndUsers') {
		let data={};
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('articles');
			collection.find().sort({date: 1}).toArray(function(err, dataNews){
				if (err) throw err
				if (dataNews) {
					data.dataNews = dataNews;
				}
				let collection = myDB.collection('users');
				collection.find().sort({name: 1}).toArray(function(err, dataUsers){
					if (err) throw err
					if (dataUsers) {
						for (var i = 0; i < dataUsers.length; i++) {
							delete dataUsers[i].password;
						}
						data.dataUsers = dataUsers;
						data.connectedPlayerList = connectedPlayerList;
						res.json(data);
					}
					client.close();
				});
			});
		});
	}

	// get user's data
	if (req.body.request && req.body.request === 'getUser') {
		let connected = false;

		if (req.body.userDatas && req.body.userDatas.gold) {
			req.sessions.gold = req.body.userDatas.gold
		}
		if (req.body.userDatas && req.body.userDatas.level)	{
			req.sessions.level = req.body.userDatas.level
		}

		if (req.session && req.session.user) {
			connected = true;

			// Add this user to the connectedPlayerList
			let alreadyListed = false;
			for (var i = 0; i < connectedPlayerList.length; i++) {
				if(connectedPlayerList[i].profil === req.session.user) {
					alreadyListed = true;
				}
			}

			if (!alreadyListed) {
				connectedPlayerList.push({
					profil: routMod.getUserName(req),
					avatar: getAvatar(req),
				})

				console.log(req.body.user+' has join react page')
				console.log('connected users : ',connectedPlayerList)
			}	
		}

		let data = { 
			profil: routMod.getUserName(req),
			title: 'index', 
			message: routMod.getUserName(req), 
			avatar: getAvatar(req), 
			connected: connected, 
			notifNumber: req.session.notifNumber, 
			requestYouForFriend: 
			req.session.requestYouForFriend, 
			recommendedFriends: req.session.recommendedFriends,
			gold: req.session.gold,
			level: req.session.level,
			};

		res.json({ data:data, connectedPlayerList:connectedPlayerList })
	}

	if (req.body.request && req.body.request === 'disconnection') {
		if (req.body.user) {
			for (var i = 0; i < connectedPlayerList.length; i++) {
				if (connectedPlayerList[i].profil === req.body.user) {
					connectedPlayerList.splice(i,1)
					console.log(req.body.user+' has left react page')
					console.log('connected users : ',connectedPlayerList)
				}
			}
		}
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

	// Delete a user
	if (req.body.request && req.body.request === 'deleteUser' && req.session && req.session.user) {
		client.connect(uri, function () {
			myDB = client.get().db('twoPrisoners');
			let collection = myDB.collection('users');
		   	collection.remove( { "name" : req.body.name }, function(err, result) {
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

	// Disconnect
	if (req.body.request && req.body.request === 'disconnect' && req.session && req.session.user) {
		req.session.destroy(function(err) {
			res.redirect('back');
		});
	}
});

// Autres routes
router.use("/login", require("./login"));
router.use("/register", require("./register"));
router.use("/disconnect", require("./disconnect"));
router.use("/lobby", require("./lobby"));
router.use("/profil", require("./profil"));
router.use("/profil/:profilName", require("./profil"));
router.use("/game", require("./game"));
router.use("/game/:number", require("./game"));
router.use("/hallOfFame", require("./hallOfFame"));
router.use("/cubekatraz", require("./cubekatraz"));

module.exports = router;