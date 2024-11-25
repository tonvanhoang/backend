const express = require('express');
const router = express.Router();
const modelsReel = require('../models/reel');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const cloudinary = require('cloudinary').v2;

let gfs;
mongoose.connection.once('open', () => {
    gfs = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'video'
    });
});

// 2. Cấu hình storage
const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/mangxahoi',
    file: (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'video'
        };
    }
});

// 3. Cấu hình upload
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file video!'), false);
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    }
});

// GET tất cả reel với phân trang
router.get('/allReel', async (req, res) => {
    try {
        const data = await modelsReel.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// GET reel theo account ID
router.get('/reelByAccount/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await modelsReel.find({ idAccount: id })
            .populate('idAccount', 'username avatar')
            .sort({ dateReel: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// GET chi tiết reel theo ID
router.get('/reelByID/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await modelsReel.findById(id)
            .populate('idAccount', 'username avatar');
        
        if (!data) {
            return res.status(404).json({ message: 'Không tìm thấy reel' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// GET video stream
router.get('/video/:id', async (req, res) => {
    try {
        const reel = await modelsReel.findById(req.params.id);
        const videoId = new mongoose.Types.ObjectId(reel.video);
        const downloadStream = gfs.openDownloadStream(videoId);
        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi stream video', error: error.message });
    }
});

// POST thêm reel mới
router.post('/add', upload.single('video'), async (req, res) => {
    try {
        const { title, idAccount, content } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng upload video' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "reels"
        });

        const newReel = await modelsReel.create({
            title,
            idAccount,
            video: result.secure_url,
            content,
            dateReel: new Date().toISOString().split('T')[0]
        });

        res.status(201).json({
            message: 'Thêm thành công',
            data: newReel
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// PUT cập nhật reel
router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        const updatedReel = await modelsReel.findByIdAndUpdate(
            id,
            { title, content },
            { new: true } // Trả về document sau khi update
        );

        if (!updatedReel) {
            return res.status(404).json({ message: 'Không tìm thấy reel' });
        }

        res.json({ message: 'Cập nhật thành công', data: updatedReel });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// DELETE xóa reel
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reel = await modelsReel.findById(id);
        
        if (!reel) {
            return res.status(404).json({ message: 'Không tìm thấy reel' });
        }

        // Xóa video từ GridFS
        if (reel.video) {
            await gfs.delete(new mongoose.Types.ObjectId(reel.video));
        }

        // Xóa document
        await modelsReel.findByIdAndDelete(id);
        
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
