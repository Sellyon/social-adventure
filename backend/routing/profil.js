const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(path.join(__dirname, '/../dbs/db.js'));
const routMod = require(__dirname + '/routerModules/routerModule.js');
const uri = "mongodb+srv://yoannmroz:ChristopheMonGodetBLOL@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';
var myDB;
var router = express.Router();

const store = new MongoDBStore({
	uri: uri,
	databaseName: 'twoPrisoners',
	collection: 'sessions'
});

store.on('error', function(error) {
	console.log(error);
});

router.use(session({
  secret: secret,
  store: store,
  saveUninitialized : true,
  resave: false
}));

const getAvatar = function (req) {
	if (req.session && req.session.avatar) {
		return req.session.avatar
	} else {
		return '/images/usersAvatars/placeholderAvatar.png'
	}
}

const editDescription = function (req, res, collection) {
	collection.updateOne(
		{name: req.params.profilName},
		{ $set: { description: req.body.editDescription } }, function(err,records){
			renderProfile(req, res);
	});
}

const editAvatar = function (req, res, collection) {
	collection.updateOne(
		{name: req.params.profilName},
		{ $set: { avatar: req.body.editAvatar } }, function(err,records){
			req.session.avatar = req.body.editAvatar;
			renderProfile(req, res);
	});
}

const addRequestFriend = function (req, res, collection, userName) {
	let consultedProfile = req.body.addFriend;
	collection.updateOne(
		{name: userName},
		{ $push: { friendsYouRequest: consultedProfile } }, function(err,records){
		collection.updateOne(
			{name: consultedProfile},
			{ $push: { requestYouForFriend: userName } }, function(err,records){
				renderProfile(req, res);
		});
	});
}

const acceptRecievedRequest = function (req, res, collection, userName) {
	let newFriend = req.body.acceptRecievedRequest;
	collection.find({name: userName}).toArray(function(err, data){
	 	if (err) throw err;
	 	console.log(data[0].friends[newFriend]);
		if (data[0].friends[newFriend] === undefined){
			console.log('personne');
			collection.updateOne(
				{name: userName},
				{ $push: { friends: newFriend } }, function(err,records){
				collection.updateOne(
					{name: newFriend},
					{ $push: { friends: userName } }, function(err,records){
					collection.updateOne(
						{name: newFriend},
						{ $pull: { friendsYouRequest: userName } }, function(err,records){
						collection.updateOne(
							{name: userName},
							{ $pull: { requestYouForFriend: newFriend } }, function(err,records){
								renderProfile(req, res);
						});
					});
				});
			});
		} else {
			console.log('quelq un');
			renderProfile(req, res);
		}
	});
}

const refuseRecievedRequest = function(req, res, collection, userName) {
	let refusedFriend = req.body.refuseRecievedRequest;
	collection.updateOne(
		{name: refusedFriend},
		{ $pull: { friendsYouRequest: userName } }, function(err,records){
		collection.updateOne(
			{name: userName},
			{ $pull: { requestYouForFriend: refusedFriend } }, function(err,records){
				renderProfile(req, res);
		});
	});
}

const cancelRequestSent = function(req, res, collection, userName) {
	let canceledFriend = req.body.cancelRequestSent;
	collection.updateOne(
		{name: canceledFriend},
		{ $pull: { requestYouForFriend: userName } }, function(err,records){
		collection.updateOne(
			{name: userName},
			{ $pull: { friendsYouRequest: canceledFriend } }, function(err,records){
				renderProfile(req, res);
		});
	});
}

const renderProfile = function (req, res) {
	let connected = false;
	let userName = routMod.getUserName(req);
	if (req.session && req.session.user) {
		connected = true
	}

	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		collection.find({name: req.params.profilName}).toArray(function(err, data){
		  if (err) throw err;
		  if (data[0] !== undefined){
		  	let isUserFriend = false;
		  	if (userName === data[0].name) {
		  		var titleprofil = 'Votre profil';
		  	} else {
		  		var titleprofil = req.params.profilName;
		  	}

		  	// System to show "add a new friend" button when visiting his profile
		  	if (userName === 'mysterieux inconnu' || data[0].name === userName) {
				isUserFriend = true;
			} else {

				// Here we check if this profile is not already a friend of user
				for (var i = 0; i < data[0].friends.length; i++) {

					if (data[0].friends[i] === userName) {
						isUserFriend = true;
					}
				}

				// Here we check if a request has not already sent
				for (var i = 0; i < data[0].requestYouForFriend.length; i++) {
					if (data[0].requestYouForFriend[i] === userName) {
						isUserFriend = true;
					}
				}
			}

			//Re arrange preferencesList
			let preferencesList = data[0].preferencesList;
			if (!preferencesList) {
		    	preferencesList=[];
		    }
			for (var i = 0; i < preferencesList.length; i++) {
				if (preferencesList[i] === 'pref_aventure') {
					preferencesList[i] = 'Aventure'
				} else if (preferencesList[i] === 'pref_puzzle') {
					preferencesList[i] = 'Puzzle'
				} else if (preferencesList[i] === 'pref_shooter') {
					preferencesList[i] = 'Shooter'
				} else if (preferencesList[i] === 'pref_strategie') {
					preferencesList[i] = 'Startégie'
				} else if (preferencesList[i] === 'pref_mmo') {
					preferencesList[i] = 'MMO'
				} else if (preferencesList[i] === 'pref_plateformer') {
					preferencesList[i] = 'Plateformer'
				} else if (preferencesList[i] === 'pref_simulation') {
					preferencesList[i] = 'Simulations'
				} else if (preferencesList[i] === 'pref_pointNClick') {
					preferencesList[i] = 'Point\'n\'click'
				} else if (preferencesList[i] === 'pref_retro') {
					preferencesList[i] = 'Jeux retro'
				} else if (preferencesList[i] === 'pref_rpg') {
					preferencesList[i] = 'RPG'
				} else if (preferencesList[i] === 'pref_interactiveDrama') {
					preferencesList[i] = 'Interactive Drama'
				} else if (preferencesList[i] === 'pref_battleRoyal') {
					preferencesList[i] = 'Battle Royal'
				}
			}

			let userFriendList;

			if(req.session && req.session.user) {
				collection.find({name: req.session.user}).toArray(function(err, dataUser){
					if (err) throw err;
					if (dataUser[0] !== undefined){
						userFriendList = dataUser[0].friends
						const isAlreadyRecommended = function(recommendedFriends, friend) {
					        for (var i=0; i < recommendedFriends.length; i++) {
					          	if (friend === recommendedFriends[i].recommended) {
					           		return true
					          	}
					        }
					      	return false
					    }
						res.render('profil', { 
							profil: userName,
							consultedProfile: req.params.profilName,
							title: 'profil ' + req.params.profilName,
							titleprofil: titleprofil,
							friends: data[0].friends,
							gender: data[0].gender,
							birthday: data[0].birthday,
							firstName: data[0].firstName,
							lastName: data[0].lastName,
							playStyle: data[0].playStyle,
							preferencesList: preferencesList,
							friendsYouRequest: data[0].friendsYouRequest,
							requestYouForFriend: data[0].requestYouForFriend,
							description: data[0].description,
							bestScore: data[0].bestScore,
							matchPlayed: data[0].matchPlayed,
							gameFinished: data[0].gameFinished,
							bestTime: routMod.msToTime(data[0].bestTime*40),
							avatarProfil: data[0].avatar,
							avatar: getAvatar(req),
							level: data[0].level,
							connected: connected,
							recommendedFriends: data[0].recommendedFriends,
							isUserFriend: isUserFriend,
							userFriendList: userFriendList,
							isAlreadyRecommended: isAlreadyRecommended
						});
					}
				})
			} else {
				res.render('profil', { 
					profil: userName,
					consultedProfile: req.params.profilName,
					title: 'profil ' + req.params.profilName,
					titleprofil: titleprofil,
					friends: data[0].friends,
					gender: data[0].gender,
					birthday: data[0].birthday,
					firstName: data[0].firstName,
					lastName: data[0].lastName,
					playStyle: data[0].playStyle,
					preferencesList: preferencesList,
					friendsYouRequest: data[0].friendsYouRequest,
					requestYouForFriend: data[0].RequestYouForFriend,
					description: data[0].description,
					bestScore: data[0].bestScore,
					matchPlayed: data[0].matchPlayed,
					gameFinished: data[0].gameFinished,
					bestTime: routMod.msToTime(data[0].bestTime*40),
					avatarProfil: data[0].avatar,
					avatar: getAvatar(req),
					level: data[0].level,
					connected: connected,
					recommendedFriends: data[0].recommendedFriends,
					isUserFriend: isUserFriend,
					userFriendList: userFriendList
				});
			}

		  } else {
		  	res.redirect('/unknowned');
		  }
		  client.close();
		});
	});
}

const recommendation = function (req, res, collection, userName, friend, consultedProfile) {
	collection.find({name: consultedProfile}).toArray(function(err, data){
		if (err) throw err;
		if (data[0] !== undefined){
		let newRecommendedList = data[0].recommendedFriends;
		newRecommendedList.push({recommender:userName,recommended:friend})
			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('users');

				collection.update(
				   { name: consultedProfile },
				   { $set:
				      {
				        recommendedFriends: newRecommendedList,
				      }
				   }, function(err,records){
				  		if (err) res.json(err);
				  		renderProfile(req, res);
				    }
				)
			});
		} else {
			res.json('Fail to find profile of '+consultedProfile)
		}
	});
}

const cancelRecommendation = function (req, res, collection, userName, friend) {
	collection.find({name: userName}).toArray(function(err, data){
		if (err) throw err;
		if (data[0] !== undefined){
			let newRecommendedList = data[0].recommendedFriends;
			for (var i = 0; i < newRecommendedList.length; i++) {
				console.log(newRecommendedList[i].recommended, friend)
				if (newRecommendedList[i].recommended === friend) {
					newRecommendedList.splice(i,1);
					i = newRecommendedList.length;
				}
			}
			console.log(newRecommendedList)
			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('users');
				collection.update(
				   { name: userName },
				   { $set:
				      {
				        recommendedFriends: newRecommendedList,
				      }
				   }, function(err,records){
				  		if (err) res.json(err);
				  		renderProfile(req, res);
				    }
				)
			});
		} else {
			res.json('Fail to find profile of '+userName)
		}
	});
}

const acceptRecommendation = function (req, res, collection, userName, friend) {
	console.log(friend)
	collection.find({name: userName}).toArray(function(err, data){
		if (err) throw err;
		if (data[0] !== undefined){
			let newRecommendedList = data[0].recommendedFriends;
			let newFriendsList = data[0].friends
			for (var i = 0; i < newRecommendedList.length; i++) {
				if (newRecommendedList[i].recommended === friend) {
					newRecommendedList.splice(i,1);
					i = newRecommendedList.length;
				}
			}
			console.log(newRecommendedList, friend)
			newFriendsList.push(friend)
			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('users');
				collection.update(
				   { name: userName },
				   { $set:
				      {
				        recommendedFriends: newRecommendedList,
				        friends: newFriendsList,
				      }
				   }, function(err,records){
				  		if (err) res.json(err);
				  		renderProfile(req, res);
				    }
				)
			});
		} else {
			res.json('Fail to find profile of '+userName)
		}
	});
}

//*********************************************************************//
//***************************** Routes ********************************//
//*********************************************************************//

router.get('/', [routMod.requireLogin], function (req, res) {
	res.redirect('/profil/' + routMod.getUserName(req));
});

router.get('/:profilName', function (req, res) {
	renderProfile(req, res);
});

router.post('/:profilName', function(req, res) {
	let connected = false;
	let userName = routMod.getUserName(req);
	if (req.session && req.session.user) {
		connected = true
	}

	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		// If a request to modify description is done AND the user in session is the owner of the profile the request is accepted
		if (req.params.profilName === userName && req.body.editDescription) {
			editDescription (req, res, collection);
		}
		// If a request to modify avatar is done AND the user in session is the owner of the profile the request is accepted
		if (req.params.profilName === userName && req.body.editAvatar) {
			editAvatar (req, res, collection);
		}
		// If a request to add consulted profile is done AND the user in session is NOT the owner of the profile the request is accepted
		else if (req.body.addFriend && userName !== req.body.addFriend) {
			addRequestFriend(req, res, collection, userName);
		}

		// System to accept a friend request from someone to the user
		else if (req.body.acceptRecievedRequest) {
			acceptRecievedRequest(req, res, collection, userName);
		}

		// System to refuse a friend request from someone to the user
		else if (req.body.refuseRecievedRequest) {
			refuseRecievedRequest(req, res, collection, userName);
		}

		// System to cancel a friend request sent from user to someone
		else if (req.body.cancelRequestSent) {
			cancelRequestSent(req, res, collection, userName);
		}

		// System to make a friend recommendation to someone
		else if (req.body.recommendation) {
			const recommendationData=JSON.parse(req.body.recommendation)
			recommendation(req, res, collection, userName, recommendationData.friend, recommendationData.consultedProfile);
		}

		// System to cancel a friend recommendation from someone
		else if (req.body.cancelRecommendation) {
			const recommendationData=JSON.parse(req.body.cancelRecommendation)
			cancelRecommendation(req, res, collection, userName, recommendationData.recommended);
		}

		// System to accept a friend recommendation from someone
		else if (req.body.acceptRecommendation) {
			const recommendationData=JSON.parse(req.body.acceptRecommendation)
			acceptRecommendation(req, res, collection, userName, recommendationData.recommended);
		}

		// You should not pass here, there is a problem with post method
		else {
			console.log('You should not pass here, there is a problem with post method, look at req.body : ' + req.body);
			renderProfile(req, res);
		}
	});
})

module.exports = router;
