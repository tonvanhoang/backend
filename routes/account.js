var express = require('express');
var router = express.Router();
const modelsAccount = require('../models/account')
const modelsFriendship = require('../models/friendship')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

router.get('/allAccount', async function(req, res, next) {
    const data = await modelsAccount.find();
    res.json(data)
});
router.get('/friendsAccount/:idAccount', async function(req, res, next) {
    try {
        const { idAccount } = req.params;
        // Tìm kiếm các mối quan hệ bạn bè với trạng thái 'accepted' nơi idAccount là người dùng đăng nhập
        const friendships = await modelsFriendship.find({
            $or: [
                { owner: idAccount, status: 'accepted' },
                { idAccount: idAccount, status: 'accepted' }
            ]
        }).populate('owner idAccount', '_id');
        const ownerIds = friendships.map(friend => {
            return friend.owner._id.toString() === idAccount.toString() ? friend.idAccount._id : friend.owner._id;
        });
        console.log("Owner IDs:", ownerIds);
        // Lấy thông tin tài khoản của các owner
        const accounts = await modelsAccount.find({
            _id: { $in: ownerIds }
        }).sort({ date: -1 });
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách tài khoản owner', error });
    }
});
router.get('/nguoitheodoi/:idAccount', async function(req, res, next) {
    try {
        const { idAccount } = req.params;
        // Tìm kiếm các mối quan hệ bạn bè với trạng thái 'accepted' nơi idAccount là người dùng đăng nhập
        const friendships = await modelsFriendship.find({
            $or: [
                { owner: idAccount, status: 'đang theo dõi' },
                { idAccount: idAccount, status: 'đang theo dõi' }
            ]
        }).populate('owner idAccount', '_id');
        const ownerIds = friendships.map(friend => {
            return friend.owner._id.toString() === idAccount.toString() ? friend.idAccount._id : friend.owner._id;
        });
        console.log("Owner IDs:", ownerIds);
        // Lấy thông tin tài khoản của các owner
        const accounts = await modelsAccount.find({
            _id: { $in: ownerIds }
        }).sort({ date: -1 });
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách tài khoản owner', error });
    }
});

router.get('/accountByID/:id', async function(req, res, next) {
    const {id} = req.params;
    const data = await modelsAccount.findOne({'_id':id});
    res.json(data)
});
router.get('/accountByIDS/:id', async function(req, res, next) {
    const {id} = req.params;
    const data = await modelsAccount.find({'_id':id});
    res.json(data)
});
// đăng kí
    router.post('/register', async function(req,res,next) {
        try{
            const {_id} = new mongoose.Types.ObjectId();
            const {firstName,lastName,password,email,avata,phoneNumber,birth,lastTimeOnline}= req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const data  = await modelsAccount.create({_id,firstName,lastName,password:hashedPassword,email,avata,phoneNumber,birth,lastTimeOnline})
            res.status(200).json({message:'thêm thành công',data})
            }catch(err){
                console.error('lỗi',err);
                res.status(500).json({err:"đã lỗi"})
        }
    })
router.put('/editName/:id', async function (req, res, next) {
    const { id } = req.params
    const { firstName, lastName } = req.body
    try {
        const data = await modelsAccount.findByIdAndUpdate(id,{ firstName, lastName },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
//phone
router.put('/editPhone/:id', async function (req, res, next) {
    const { id } = req.params
    const { phoneNumber } = req.body
    try {
        const data = await modelsAccount.findByIdAndUpdate(id,{ phoneNumber },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
// email
router.put('/editEmail/:id', async function (req, res, next) {
    const { id } = req.params
    const { email } = req.body
    try {
        const data = await modelsAccount.findByIdAndUpdate(id,{ email },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
// email
router.put('/editPassword/:id', async function (req, res, next) {
    const { id } = req.params
    const { password } = req.body
    try {
        const hashpw = await bcrypt.hash(password,10)
        const data = await modelsAccount.findByIdAndUpdate(id,{ password:hashpw },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
// gender
router.put('/editGender/:id', async function (req, res, next) {
    const { id } = req.params
    const { gender } = req.body
    try {
        const data = await modelsAccount.findByIdAndUpdate(id,{ gender },{ new: true }
        )
        res.json({ message: 'Cập nhật thành công', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error })
    }
})
// Đăng nhập
router.post('/login', async function(req, res, next) {
    try {
        const { email, password } = req.body;
        // Tìm người dùng theo email
        const user = await modelsAccount.findOne({ email });
        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
        // Nếu đăng nhập thành công, có thể trả về thông tin người dùng hoặc tạo token
        res.status(200).json({ message: 'Đăng nhập thành công', user: {avata:user.avata,_id:user._id, email: user.email, firstName: user.firstName, lastName: user.lastName ,role:user.role} });
    } catch (err) {
        console.error('Lỗi', err);
        res.status(500).json({ err: 'Đã có lỗi xảy ra' });
    }
});
router.delete('/delete/:id',async function(req,res,next){
    try {
        const {id} = req.params;
        await modelsAccount.findByIdAndDelete(id);
        res.status(201).json('xóa thành công')
    } catch (error) {
        res.status(500).json('xóa không thành công')
    }
})
module.exports = router;
