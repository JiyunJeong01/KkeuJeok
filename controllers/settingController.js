const userModel = require('../models/User');
const bcryptjs = require('bcryptjs');

module.exports = {
  loadSetting: (req, res) => {
    res.render("setting");
  },

  changePassword: async (req, res) => {
    try {
      if (req.session.user) {
        const userId = req.session.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const user = await userModel.getUserById(userId);

        // 비밀번호가 일치하지 않는 경우
        const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.send('<script>alert("비밀번호가 일치하지 않습니다."); window.location.replace("/setting");</script>');
        }

        if (newPassword === confirmPassword) {
          const hashedPassword = await bcryptjs.hash(newPassword, 12);
          await userModel.changePassword(userId, hashedPassword)
          res.redirect('<script>alert("비밀번호가 변경되었습니다."); window.location.replace("/");</script>');
        }
      } else {
        res.redirect('/home')
      }
    } catch (error) {
      console.error(error);
    }
  },

  deleteAccount: (req, res) => {
    const { password } = req.body;
    console.log(password);
  },
};