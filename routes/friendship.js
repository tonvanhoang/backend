var express = require('express');
var router = express.Router();
const modelsFriend = require('../models/friendship')
const mongoose = require('mongoose')
/* GET home page. */
router.get('/allFriendship', async function(req, res, next) {
    const data = await modelsFriend.find();
    res.json(data)
});
router.get('/detail/:id', async function(req, res, next) {
    const {id}= req.params
    const data = await modelsFriend.findOne({'owner':id});
    res.json(data)
});
router.post('/add', async function(req, res, next) {
    try {
        const _id = new mongoose.Types.ObjectId();
        const { status, idAccount, owner } = req.body;
        // Ghi log req.body để kiểm tra dữ liệu
        console.log(req.body);
        const data = await modelsFriend.create({ _id, status, idAccount, owner });
        res.status(201).json({ message: 'Thêm thành công', data });
    } catch (error) {
        console.error('Lỗi:', error); // Ghi log chi tiết lỗi
        res.status(500).json({ message: 'Không thành công', error });
    }
 });
 router.put('/xacnhan/:id', async function (req, res, next) {
    const { id } = req.params
    const { status } = req.body
    try {
        const data = await modelsFriend.findByIdAndUpdate(id,{ status },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
module.exports = router;
