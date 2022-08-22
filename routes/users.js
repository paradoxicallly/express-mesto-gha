const router = require('express').Router();
const { getUsers, getUserById, createUser, patchAvatar, patchProfile } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);

module.exports = router;