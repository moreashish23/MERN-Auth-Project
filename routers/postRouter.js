const express = require("express");
const postContoller = require("../controllers/postController")
const { identifier } = require("../middlewares/identification");

const router = express.Router();

router.get('/all-posts', postContoller.getPosts);
router.get('/single-post', postContoller.singlePost);
router.post('/create-post', identifier, postContoller.createPost);

router.put('/update-post', identifier, postContoller.updatePost);
router.delete('/delete-post', identifier, postContoller.deletePost);


module.exports = router