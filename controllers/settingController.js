const UserModel = require('../models/User');
const MemoModel = require('../models/Memo');
const FileModel = require('../models/File');
const bcryptjs = require('bcryptjs');
const memoController = require('./memoController');

module.exports = {
  loadSetting: (req, res) => {
    res.render("setting");
  },

  changePassword: async (req, res) => {
    try {
      if (req.session.user) {
        const userId = req.session.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const user = await UserModel.getUserById(userId);

        // 비밀번호가 일치하지 않는 경우
        const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.send('<script>alert("비밀번호가 일치하지 않습니다."); window.location.replace("/setting");</script>');
        }

        if (newPassword === confirmPassword) {
          const hashedPassword = await bcryptjs.hash(newPassword, 12);
          await UserModel.changePassword(userId, hashedPassword)
          res.send('<script>alert("비밀번호가 변경되었습니다."); window.location.replace("/");</script>');
        }
      } else {
        res.redirect('/home')
      }
    } catch (error) {
      console.error(error);
    }
  },

  deleteAccount: async (req, res) => {
    try {
      if (req.session.user) {
        const userId = req.session.user.id;
        const { password } = req.body;

        const user = await UserModel.getUserById(userId);

        // 비밀번호가 일치하지 않는 경우
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
          return res.send('<script>alert("비밀번호가 일치하지 않습니다."); window.location.replace("/setting");</script>');
        }

        memoIds = await MemoModel.deleteMemosByUserId(userId);
        await FileModel.deleteFilesByMemoIds(userId, memoIds);
        await UserModel.deleteUser(userId);
        req.session.destroy()
        res.send('<script>alert("회원탈퇴 되었습니다."); window.location.replace("/");</script>');
      } else {
        res.redirect('/home')
      }
    } catch (error) {
      console.error(error);
    }
  },
};