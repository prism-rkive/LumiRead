const books = require('../models/books');
const users = require('../models/users');

const addBook = async (req, res)=> {

if(!req.body.ibn) return res.json({status : false, type : "empty"});
// same ibn er book exist kore kina ...

else{
    const checkBook = await books.find({ibn : req.body.ibn});
    if(checkBook.length>0)
    {
        return res.json({status : false, type :"exists"});

    }

const newBook = new books({
    ibn: req.body.ibn,
      title: req.body.title,
      added_by: req.userData.user_id,
      author: req.body.author,
      language: req.body.language,
      cover_img: req.body.cover_img,
      description: req.body.description,
      buy_url: req.body.buy_url,
      year: req.body.year,
      genre: req.body.genre,

});
const addedUser = await users.findById(req.userData.user_id);
if (!addedUser) return res.json({status : false, type :"userdoesntexist"})
else addedUser.books.added.push(newBook._id); 

try{

    await newBook.save();
    await addedUser.save();
    return res.json({status: true});
} catch(e)
{
    return res.json({status : false, type : "save", error : e});
}

}





};

module.exports = addBook;























