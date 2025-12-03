

const router = require('express').Router();
const checkAuth = require('./client/checkAuth');

// Public routes
router.get('/', (req, res) => {
    res.end('Server is running');
});

// Auth routes
const register = require('./client/register');
router.post('/register', register);

const login = require('./client/login');
router.post('/login', login);


const isAuthed = require("./client/isAuth");
router.post('/isAuthed', checkAuth, isAuthed);

const addbook = require('./client/addbook');
router.post('/addbook', checkAuth, addbook);

const checkBook = require('./client/checkBook');

router.post('/checkbook', checkBook)

const search = require('./client/search');
router.post('/search', search);

const getBook = require('./client/getBook');
router.post('/getbook', getBook);






module.exports = router;


