
const books = require('../models/books')

const checkBook = async(req, res)=>{
    try{ //isbn dise kina
        if(!req.body.ibn){
            return res.json({
                status : false,
                message : "ISBN is required"

            });
        }

        //search book with provided isbn
        const existingBook = await books.findOne({ibn : req.body.ibn});

        if(existingBook)
        {
            return res.json({
                status : true,
                exists: true,
                message:"Book already exists in Database",
                book:{
                    ibn : existingBook.ibn,
                    title : existingBook.title,
                    author : existingBook.author,
                    cover_img : existingBook.cover_img


                }
            });
        }

    //book doest exit, user can add it
    return res.json({
        status : true,
        exists: false,
        message :"Book not found, you can add it!!"
    })


    }catch(error)
    {
        return res.json({
            status : false,
            message :"Error checking book",
            error : error.message
        });
    }
};
module.exports = checkBook;