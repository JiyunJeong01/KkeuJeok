const userModel = require('../models/User');
const bcryptjs = require('bcryptjs');

module.exports = {

  // 로그인 페이지 로드
  loginPage: (req, res) => {
    res.render("login");
  },

  // 로그인 처리
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 입력된 이메일로 사용자 찾기
      const user = await userModel.getUserByEmail(email);

      // 사용자가 존재하지 않는 경우
      if (!user) {
        return res.status(404).json({ field: 'email', error: '회원정보를 찾을 수 없습니다.' });
      }

      // 비밀번호가 일치하지 않는 경우
      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ field: 'password', error: '비밀번호가 일치하지 않습니다.' });
      }

      // 로그인 성공 시, 세션에 사용자 정보 저장
      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      // 로그인 성공
      res.redirect("/");

    } catch (error) {
      console.error(error);
    }
  },

  // 로그아웃 처리
  logout: async (req, res) => {
    try {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ error: 'Failed to log out' });
        }
        res.redirect('/');
      });

    } catch (error) {
      console.error(error);
    }
  },

  // 회원가입 페이지 로드
  accountPage: (req, res) => {
    res.render("account");
  },

  // 중복 이메일 찾기
  checkEmailDuplicate: async (req, res) => {
    try {
      const email = req.body.email;
      const user = await userModel.getUserByEmail(email);
      if (user) {
        return res.status(200).json({ isDuplicate: true });
      } else {
        return res.status(200).json({ isDuplicate: false });
      }
    } catch (error) {
      console.log("checkEmailDuplicate 실행 중 오류:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 유저 가입 처리
  account: async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const hashedPassword = await bcryptjs.hash(password, 12);

      await userModel.creatdUser(email, name, hashedPassword);
      res.redirect("/login");
    } catch (error) {
      console.error(error);
    }
  }
};