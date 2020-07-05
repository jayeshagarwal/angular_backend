const router = require('express').Router()
const postsController = require('../controllers/post')
const auth = require('../middleware/auth')
const multer = require('../middleware/image')

router.get('/', postsController.getPosts)
router.get('/:id', postsController.getPost)

router.use(auth)
router.post('/', multer , postsController.createPost)
router.put('/:id', multer , postsController.updatePost)
router.delete('/:id', postsController.deletePost )

module.exports = router