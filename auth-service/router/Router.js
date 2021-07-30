const express = require('express');

const router = express.Router();
const { requireAdmin } = require('../verify/verify');
const { verify } = require('../verify/verify');
const { requireUser } = require('../verify/verify');
const { requireAdminOrHr } = require('../verify/verify');
const { requireCurrent } = require('../verify/verify');

const auth = require('../controller/authController');
const account = require('../controller/accountController');

const consumeAuthRequest = require('../controller/messageBroker.controller')
router.use(verify);

router.get('/consumeAuthReq', consumeAuthRequest.consumeAuthRequest)
router.get('/consumeAuthReqCV', consumeAuthRequest.consumeAuthRequestCV)

router.post('/api/auth/sign_in', auth.login);

const roles = require('../controller/rolesController');

router.post('/api/roles/create_role', roles.createRoles);
router.get('/api/role/find_role/:roles_id', roles.getByRole);


router.post('/api/auth/reset_password', auth.resetPassword);
router.post('/api/auth/resend_email', auth.resendEmail);
router.delete('/api/auth/logout', auth.logout);
router.post('/api/register', account.createAccount)


router.post('/api/account/create_account', account.createAccount);
router.get('/api/account/list_account/:roles_id', requireAdmin, account.listAccount);
router.post('/api/account/find_email', account.getByEmail);
router.get('/api/account/show_account/:roles_id', requireAdmin, account.showAccount);
router.put('/api/account/edit_account/:user_id', requireAdmin, account.editUser);
router.delete('/api/account/delete_account/:user_id', requireAdmin, account.deleteUser);

const profile = require('../controller/profileController');

router.get('/api/profile/show_profile/:user_id', requireCurrent, profile.showProfile);
router.put('/api/profile/change_password', requireUser, profile.changePassword);
router.put('/api/profile/edit_profile/:user_id', requireCurrent, account.editUser);

module.exports = router;
