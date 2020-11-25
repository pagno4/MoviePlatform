const express = require('express');
const User = require('../controller/user');
const Token = require('../controller/token');
const Email = require('../controller/email');

const Movies = require('../controller/tmdb/movies');
const TVPrograms = require('../controller/tmdb/tv');
const Actors = require('../controller/tmdb/actors');

const router = express.Router();

// User
router.get('/user/same_field', (req, res) => User.sameField(req, res));
router.post('/user/sign_in', (req, res) => User.signIn(req, res));
router.post('/user/new_user', (req, res) => User.signUp(req, res));

// Email
router.get('/email/validation', (req, res) => Email.validationEmail(req, res));

// Token
router.post('/token/email/confirmation', (req, res) => Token.checkTokenEmail(req, res));
router.post('/token/email/resend', (req, res) => Token.resendTokenEmail(req, res));
router.post('/token/authentication/check', (req, res) => Token.checkToken(req, res));

// Movie
router.get('/tmdb/movies/popular', (req, res) => Movies.popular(req, res));
router.get('/tmdb/movies/top_rated', (req, res) => Movies.topRated(req, res));
router.get('/tmdb/movies/upcoming', (req, res) => Movies.upcoming(req, res));

// TV
router.get('/tmdb/tv/popular', (req, res) => TVPrograms.popular(req, res));
router.get('/tmdb/tv/top_rated', (req, res) => TVPrograms.topRated(req, res));

// Actors
//router.get('/tmdb/actors/popular', (req, res) => Actors.popular(req, res));

module.exports = router;

