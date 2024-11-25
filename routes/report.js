var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const modelsReport = require('../models/report');

// Lấy tất cả các bài viết đã yêu thích
router.get('/all', async function(req, res, next) {
    const data = await modelsReport.find().sort({_id:-1});
    res.json(data);
});

router.post('/add', async function(req, res, next) {
    try {
        const _id = new mongoose.Types.ObjectId();
        const { idAccount, idPost, content ,owner} = req.body;
        const data = await modelsReport.create({ _id, idAccount, idPost, content,owner });
        res.status(201).json({ message: 'thành công', data }); // Gộp message và data vào một đối tượng
    } catch (error) {
        res.status(500).json({ message: 'không thành công', error }); // Gộp message và error vào một đối tượng
    }
});
router.put('/editRequest/:id', async function (req, res, next) {
    const { id } = req.params
    const { request } = req.body
    try {
        const data = await modelsReport.findByIdAndUpdate(id,{ request },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
router.put('/editStatus/:id', async function (req, res, next) {
    const { id } = req.params
    const { statusReport } = req.body
    try {
        const data = await modelsReport.findByIdAndUpdate(id,{ statusReport },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
router.delete('/delete/:id', async function(req, res, next) {
    try {
        const {id} = req.params
        const data = await modelsReport.findByIdAndDelete({'_id':id});
        res.status(201).json({ message: 'thành công', data }); // Gộp message và data vào một đối tượng
    } catch (error) {
        res.status(500).json({ message: 'không thành công', error }); // Gộp message và error vào một đối tượng
    }
});
module.exports = router;
