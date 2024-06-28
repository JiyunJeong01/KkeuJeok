const userModel = require('../models/User');

module.exports = {

  // 로그인 페이지 로드
  loginPage: (req, res) => {
    res.render("login");
  },

  // 로그인 처리
  login: async (req, res) => {
    try{
      const { email, password } = req.body;

      // 입력된 이메일로 사용자 찾기
      const user = await userModel.getUserByEmail(email);

      // 사용자가 존재하지 않는 경우
      if (!user) {
          return res.status(404).json({ field: 'email', error: '회원정보를 찾을 수 없습니다.' });
      }

      // 비밀번호가 일치하지 않는 경우
      if (!password == user.password) {
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

  // 회원가입 페이지 로드
  accountPage: (req, res) => {
    res.render("account");
  },

  // 유저 가입 처리
  account: async (req, res) => {
    try {
      const { email, name, password } = req.body;
      await userModel.creatdUser(email, name, password);
      res.redirect("/login");
    } catch (error) {
      console.error(error);
    }
  }
};