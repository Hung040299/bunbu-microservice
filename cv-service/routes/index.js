const register = require('../controllers/register.controller')
const account = require('../controllers/account.controller')
const login = require('../controllers/login.controller')
const profile = require('../controllers/profile.controller')
const { requireAdmin, requireUser, verify,
  requireUserOrAdmin, requireCompany,
  requireCompanyOrAdmin, requireNotAdmin, requireUserOrCompany } = require('../config/jwt.service')
const passport = require('passport')
const cv = require('../controllers/cv.controller')
const cvtemplates = require('../controllers/cvtemplate.controller')
const conversation = require('../controllers/conversation.controller')
const messages = require('../controllers/messages.controller')
function route(app) {
  app.use(verify)
  
  app.get('/auth/facebook', passport.authenticate('facebook'))
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), login.facebookCallback)
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), login.googleCallback);
  app.post('/register', register)
  app.post('/login', login.logIn)
  app.put('/reset_password', login.resetPassword)

  app.get('/admin/accounts', requireAdmin, account.listAccount)
  app.post('/admin/accounts', requireAdmin, account.createAccount)
  app.get('/admin/accounts/:id', requireAdmin, account.getByID)
  app.put('/admin/accounts/:id', requireAdmin, account.updateAccount)
  app.delete('/admin/accounts/:id', requireAdmin, account.deleteAccount)

  app.post('/user/cvs', requireUser, profile.addCV)
  app.get('/user/profiles/:id', requireUser, profile.showProfile)
  app.put('/user/profiles/:id', requireUser, profile.editProfile)
  app.put('/user/profiles/change_password/:id', requireUser, profile.changePassword)
  app.get('/search/user/tagname/:tagname', profile.viewByTagName)

  app.put('/user/cvs/:cvid', requireUser, cv.editCV)
  app.get('/user/cvs/:cvid', cv.showCV)
  app.get('/download/:cvid', cv.downloadCV)
  app.delete('/user/cvs/:cvid', requireUserOrAdmin, cv.deleteCV)
  app.get('/user/cvs', requireAdmin, cv.showAllCV)
  app.get('/company/cvs/:cvid', requireCompany, cv.likeCV)
  app.post('/user/cvs/:cvid', requireUser, cv.addTagName)
  app.get('/themostviewedcv', requireCompanyOrAdmin, cv.mostView)

  app.get('/search/cv/tagname/:tagname', requireCompanyOrAdmin, cv.searchByTagName)
  app.get('/search/cv/location/:location', requireCompanyOrAdmin, cv.searchByLocation)

  app.get('/admin/cvtemplates', requireAdmin, cvtemplates.showAllCV)
  app.get('/admin/cvtemplates/:template_id', requireAdmin, cvtemplates.showCV)
  app.post('/admin/cvtemplates', requireAdmin, cvtemplates.addCV)
  app.put('/admin/cvtemplates/:template_id', requireAdmin, cvtemplates.editCV)
  app.delete('/admin/cvtemplates/:template_id', requireAdmin, cvtemplates.deleteCV)

  app.post('/conversations', requireNotAdmin, conversation.createConversation)
  app.post('/messages/:conversation_id', requireUserOrCompany, messages.createMessage);
}
module.exports = route;
