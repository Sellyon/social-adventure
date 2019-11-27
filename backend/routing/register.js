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
var a = '=';

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

const getRandomID = () => {
	let ID = '';
	for (var i = 0; i < 9; i++) {
		ID += Math.floor(Math.random() * Math.floor(10));
	}
	return ID
}

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../../build/index.html'));
})

router.post('/', function(req, res) {
	// Add user
	if (req.body.request && req.body.request === 'subscribe' && req.body.registerPack) {
		let registerPack = req.body.registerPack;
		if (registerPack.email && registerPack.pseudo && registerPack.firstName && registerPack.lastName && registerPack.birthday && registerPack.password) {

			let preferencesList=[];
			Object.keys(registerPack).map(function(key, i){
				if (/pref_.+/.test(key)){
					preferencesList.push(key)
				}
			})

			let code = getRandomID()

			let newUser = {
				name: registerPack.pseudo,
				firstName: registerPack.firstName,
				lastName: registerPack.lastName,
				password: registerPack.password,
				birthday: registerPack.birthday,
				email: registerPack.email,
				gender: registerPack.gender,
				playStyle: registerPack.playStyle,
				grade: 1,
				description: registerPack.description,
				avatar: "/images/usersAvatars/placeholderAvatar.png",
				friends: [],
				matchPlayed: 0,
				bestScore:0,
				gameFinished:0,
				bestTime:0,
				preferencesList: preferencesList,
				achievements:[],
				friendsYouRequest:[],
				requestYouForFriend:[],
				recommendedFriends:[],
				accountActivated: false,
				accountCodeActivation: code,
				gold:500,
				level:1
			}

			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('users');

				collection.find({name: newUser.name}).toArray(function(err, data){
					if (err) throw err;
					if (data[0] === undefined){
						collection.find({email: newUser.email}).toArray(function(err, data){
							if (err) throw err;
							if (data[0] === undefined){
								collection.insertOne(newUser);
								res.json({status:'OK', code:code});
								client.close();
							} else {
								message = 'Cet email est déjà utilisé, choisis-en un autre.';
								res.json(message);
								client.close();
							}
						});
					} else {
					  	message = 'Ce pseudo est déjà utilisé, choisis-en un autre.';
					  	res.json(message);
					  	client.close();
					}
				});
			});
		} else {
			message = 'Les données d\'inscriptions sont incorrects, l\'inscription est annulée.';
			if (!registerPack.email) {message+=' Email manquant.'};
			if (!registerPack.pseudo) {message+=' Pseudo manquant.'};
			if (!registerPack.firstName) {message+=' Prénom manquant.'};
			if (!registerPack.lastName) {message+=' Nom manquant.'};
			if (!registerPack.birthday) {message+=' Date d\'anniversaire manquant.'};
			if (!registerPack.password) {message+=' Mot de passe manquant.'};
			res.json(message);
			client.close();
		}
	} else if(req.body.request === 'subscribe') {
		message = 'Les données d\'inscriptions sont incorrects, l\'inscription est annulée.';
		res.json(message);
		client.close();
	}


	// Update account
	if (req.session && req.session.user && req.body.request && req.body.request === 'updateAccount' && req.body.registerPack && req.body.nameInURL) {
		let registerPack = req.body.registerPack;
		if (registerPack.email && registerPack.pseudo && req.body.nameInURL === req.session.user && registerPack.firstName && registerPack.lastName && registerPack.birthday && registerPack.password) {

			let preferencesList=[];
			Object.keys(registerPack).map(function(key, i){
				if (/pref_.+/.test(key)){
					preferencesList.push(key)
				}
			})

			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('users');

				collection.update(
				   { name: req.session.user },
				   { $set:
				      {
				        name: registerPack.pseudo,
				        firstName: registerPack.firstName,
				        lastName: registerPack.lastName,
				        name: registerPack.pseudo,
				        name: registerPack.pseudo,
				        playStyle: registerPack.playStyle,
				        description: registerPack.description,
				        preferencesList: preferencesList,
				      }
				   }, function(err,records){
				  		if (err) throw err;
				       	res.json({'status':'OK'})
				    }
				)
			});
		} else {
			message = 'Les données d\'inscriptions sont incorrects, l\'inscription est annulée.';
			if (!registerPack.email) {message+=' Email manquant.'};
			if (!registerPack.pseudo) {message+=' Pseudo manquant.'};
			if (!registerPack.firstName) {message+=' Prénom manquant.'};
			if (!registerPack.lastName) {message+=' Nom manquant.'};
			if (!registerPack.birthday) {message+=' Date d\'anniversaire manquant.'};
			if (!registerPack.password) {message+=' Mot de passe manquant.'};
			res.json(message);
			client.close();
		}
	} else if(req.body.request === 'subscribe') {
		message = 'Les données d\'inscriptions sont incorrects, l\'inscription est annulée.';
		res.json(message);
		client.close();
	}



	// ***************** send mail ***************************//

	if (req.body.request && req.body.request === 'sendMail' && req.body.name && req.body.email && req.body.code && req.body.password) {
		console.log('mailing');

	    const nodemailer = require('nodemailer');
	    const code = req.body.code;
	    const password = req.body.password;
	    const name = req.body.name

		const transporter = nodemailer.createTransport({
		 service: 'gmail',
		 auth: {
		        user: 'master.sellyon@gmail.com',
		        pass: 'echariandre'
		    }
		});

		const amp = 
		`<!DOCTYPE html>
		<html>
		<head>

		  <meta charset="utf-8">
		  <meta http-equiv="x-ua-compatible" content="ie=edge">
		  <title>Email Confirmation</title>
		  <meta name="viewport" content="width=device-width, initial-scale=1">
		  <style type="text/css">
		  /**
		   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
		   */
		  @media screen {
		    @font-face {
		      font-family: 'Source Sans Pro';
		      font-style: normal;
		      font-weight: 400;
		      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
		    }
		    @font-face {
		      font-family: 'Source Sans Pro';
		      font-style: normal;
		      font-weight: 700;
		      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
		    }
		  }
		  /**
		   * Avoid browser level font resizing.
		   * 1. Windows Mobile
		   * 2. iOS / OSX
		   */
		  body,
		  table,
		  td,
		  a {
		    -ms-text-size-adjust: 100%; /* 1 */
		    -webkit-text-size-adjust: 100%; /* 2 */
		  }
		  /**
		   * Remove extra space added to tables and cells in Outlook.
		   */
		  table,
		  td {
		    mso-table-rspace: 0pt;
		    mso-table-lspace: 0pt;
		  }
		  /**
		   * Better fluid images in Internet Explorer.
		   */
		  img {
		    -ms-interpolation-mode: bicubic;
		  }
		  /**
		   * Remove blue links for iOS devices.
		   */
		  a[x-apple-data-detectors] {
		    font-family: inherit !important;
		    font-size: inherit !important;
		    font-weight: inherit !important;
		    line-height: inherit !important;
		    color: inherit !important;
		    text-decoration: none !important;
		  }
		  /**
		   * Fix centering issues in Android 4.4.
		   */
		  div[style*="margin: 16px 0;"] {
		    margin: 0 !important;
		  }
		  body {
		    width: 100% !important;
		    height: 100% !important;
		    padding: 0 !important;
		    margin: 0 !important;
		  }
		  /**
		   * Collapse table borders to avoid space between cells.
		   */
		  table {
		    border-collapse: collapse !important;
		  }
		  a {
		    color: #1a82e2;
		  }
		  img {
		    height: auto;
		    line-height: 100%;
		    text-decoration: none;
		    border: 0;
		    outline: none;
		  }
		  </style>

		</head>
		<body style="background-color: #e9ecef;">

		  <!-- start preheader -->
		  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
		    A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
		  </div>
		  <!-- end preheader -->

		  <!-- start body -->
		  <table border="0" cellpadding="0" cellspacing="0" width="100%">

		    <!-- start logo -->
		    <tr>
		      <td align="center" bgcolor="#e9ecef">
		        <!--[if (gte mso 9)|(IE)]>
		        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
		        <tr>
		        <td align="center" valign="top" width="600">
		        <![endif]-->
		        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
		          <tr>
		            <td align="center" valign="top" style="padding: 36px 24px;">
		              <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
		                <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
		              </a>
		            </td>
		          </tr>
		        </table>
		        <!--[if (gte mso 9)|(IE)]>
		        </td>
		        </tr>
		        </table>
		        <![endif]-->
		      </td>
		    </tr>
		    <!-- end logo -->

		    <!-- start hero -->
		    <tr>
		      <td align="center" bgcolor="#e9ecef">
		        <!--[if (gte mso 9)|(IE)]>
		        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
		        <tr>
		        <td align="center" valign="top" width="600">
		        <![endif]-->
		        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
		          <tr>
		            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
		              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirmation de mail</h1>
		            </td>
		          </tr>
		        </table>
		        <!--[if (gte mso 9)|(IE)]>
		        </td>
		        </tr>
		        </table>
		        <![endif]-->
		      </td>
		    </tr>
		    <!-- end hero -->

		    <!-- start copy block -->
		    <tr>
		      <td align="center" bgcolor="#e9ecef">
		        <!--[if (gte mso 9)|(IE)]>
		        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
		        <tr>
		        <td align="center" valign="top" width="600">
		        <![endif]-->
		        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

		          <!-- start copy -->
		          <tr>
		            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
		              <p style="margin: 0;">Cliquez sur le bouton pour valider votre inscription à Social-Adventure. Si vous n'avez pas créé de compte via <a href="https://social-adventure.herokuapp.com">social-adventure.herokuapp.com</a>, vous pouvez tranquillement effacer cet email.</p>
		            </td>
		          </tr>
		          <!-- end copy -->

		          <!-- start button -->
		          <tr>
		            <td align="left" bgcolor="#ffffff">
		              <table border="0" cellpadding="0" cellspacing="0" width="100%">
		                <tr>
		                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
		                    <table border="0" cellpadding="0" cellspacing="0">
		                      <tr>
		                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
		                          <a href="https://social-adventure.herokuapp.com/?accountActivation=`+code+`" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirmer l'inscription</a>
		                        </td>
		                      </tr>
		                    </table>
		                  </td>
		                </tr>
		              </table>
		            </td>
		          </tr>
		          <!-- end button -->

		          <!-- start copy -->
		          <tr>
		            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
		              <p style="margin: 0;">Si le bouton ne fonctionne pas, copiez-collez le lien suivant dans votre barre d'adresse :</p>
		              <p style="margin: 0;"><a href="https://social-adventure.herokuapp.com/?accountActivation=`+code+`" target="_blank">https://social-adventure.herokuapp.com/?accountActivation=`+code+`</a></p>
		            </td>
		          </tr>
		          <!-- end copy -->

		          <!-- start reminder -->
		          <tr>
		            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
		              <p style="margin: 0;">Votre pseudo sur Social-Adventure : `+ name +`</p>
		              <p style="margin: 0;">Votre mot de passe associé : `+ password +`</p>
		            </td>
		          </tr>
		          <!-- end reminder -->

		          <!-- start copy -->
		          <tr>
		            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
		              <p style="margin: 0;">Cordialement,<br> l'admin de Social-Adventure</p>
		            </td>
		          </tr>
		          <!-- end copy -->

		        </table>
		        <!--[if (gte mso 9)|(IE)]>
		        </td>
		        </tr>
		        </table>
		        <![endif]-->
		      </td>
		    </tr>
		    <!-- end copy block -->

		    <!-- start footer -->
		    <tr>
		      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
		        <!--[if (gte mso 9)|(IE)]>
		        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
		        <tr>
		        <td align="center" valign="top" width="600">
		        <![endif]-->
		        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

		          <!-- start permission -->
		          <tr>
		            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
		              <p style="margin: 0;">Vous recevez ce mail suite à une demande d'inscription pour un compte associé à cet email. Si vous n'êtes pas l'auteur de cette demande vous pouvez effacer ce mail en toute sécurité.</p>
		            </td>
		          </tr>
		          <!-- end permission -->

		        </table>
		        <!--[if (gte mso 9)|(IE)]>
		        </td>
		        </tr>
		        </table>
		        <![endif]-->
		      </td>
		    </tr>
		    <!-- end footer -->

		  </table>
		  <!-- end body -->

		</body>
		</html>`

		const mailOptions = {
		  from: 'master.sellyon@gmail.com', // sender address
		  to: req.body.email, // list of receivers
		  subject: 'Activation de votre compte sur Social-Adventure 😺', // Subject line
		  html: amp// plain text body
		};

		transporter.sendMail(mailOptions, function (err, info) {
		   if(err)
		     console.log('********!!!! ERREUR !!!!********',err)
		   else
		     console.log(info);
		});


		res.json('OK')
	}
})

module.exports = router;