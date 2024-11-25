var express = require('express');
var router = express.Router();
const modelsComment = require('../models/comment');
const mongoose = require('mongoose')
/* GET home page. */
router.get('/allComment', async function(req, res, next) {
    const data = await modelsComment.find();
    res.json(data)
});
//post
router.get('/commentByPost/:id', async function(req,res,next){
    const {id} = req.params;
    const data = await modelsComment.find({'idPost':id})
    res.json(data)
})
// reel
router.get('/commentByReel/:id', async function(req,res,next){
    const {id} = req.params;
    const data = await modelsComment.find({'idReel':id})
    res.json(data)
})
//add post
router.post('/addpost', async function(req,res,next){
    try {
        const {comment,idPost,idAccount} = req.body;
        const _id = new mongoose.Types.ObjectId()
        const data = await modelsComment.create({_id,comment,idPost,idAccount})
        res.status(201).json({ message: 'Thêm thành công', data });
    } catch (error) {
        res.status(500).json({ message: 'Không thành công', error });
    }
})
// comment
router.put('/edit/:id', async function(req,res,next){
    try {
        const {id}= req.params
        const {repComment} = req.body;
        await modelsComment.findByIdAndUpdate(id,{repComment})
        res.status(201).json('bình luận thành công')
    } catch (error) {
        res.status(500).json('bình luận không thành công',error);
    }
})
router.delete('/delete/:id', async function(req,res,next){
    try {
    const {id} = req.params;
    await modelsComment.findByIdAndDelete(id)
    res.status(201).json('thành công')
    } catch (error) {
        res.status(500).json('không thành công')
    }
})
module.exports = router;
