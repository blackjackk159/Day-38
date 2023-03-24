const isAuth = require("./auth");
const router = require("express").Router();
const Post = require("../models/post.js");
const handleErrorAsync = require("../utils/handleErrorAsync");

router.post(
  "/",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const data = req.body;
    if (data.content) {
      const newPost = await Post.create({
        user: req.user.id,
        content: data.content,
        tags: data.tags,
        type: data.type,
      });
      res.status(200).json({
        status: "success",
        data: newPost,
      });
    } else {
      res.status(400).json({
        status: "false",
        message: "欄位未填寫正確，或無此 todo ID",
      });
    }
  })
);

// 新增按讚
router.post(
  "/:id/likes",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    await Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user.id },
    });

    res.status(201).json({
      status: "success",
      postId: req.params.id,
      userId: req.user.id,
    });
  })
);

// 移除按讚
router.delete(
  "/:id/likes",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user.id },
    });

    res.status(201).json({
      status: "success",
      postId: req.params.id,
      userId: req.user.id,
    });
  })
);

module.exports = router;
