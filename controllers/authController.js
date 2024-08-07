const userModel = require('../models/User');
const bcryptjs = require('bcryptjs');
const smtpTransport = require('../email');

// 랜덤 인증번호 생성 코드
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  // 로그인 페이지 로드
  loginPage: (req, res) => {
    const savedEmail = req.cookies.savedEmail || ''; // 저장된 이메일 쿠키 가져오기
    res.render('login', { savedEmail }); // login.ejs 렌더링 및 savedEmail 전달
  },

  // 로그인 처리
  login: async (req, res) => {
    const { email, password } = req.body;

    // 입력된 이메일로 사용자 찾기
    const user = await userModel.getUserByEmail(email);

    // 사용자가 존재하지 않는 경우
    if (!user) {
      return res.send('<script>alert("아이디와 비밀번호를 다시 확인해주세요."); window.location.replace("/login");</script>');
    }

    // 비밀번호가 일치하지 않는 경우
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.send('<script>alert("아이디와 비밀번호를 다시 확인해주세요."); window.location.replace("/login");</script>');
    }

    // 로그인 성공 시, 세션에 사용자 정보 저장
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    // "아이디 저장하기" 체크박스 확인
    if (req.body['remember-check']) {
      res.cookie('savedEmail', email, { maxAge: 3600 * 24 * 30 * 1000 }); // 30일 동안 저장
    } else {
      res.clearCookie('savedEmail'); // 쿠키 삭제
    }

    // 로그인 성공
    res.redirect("/");
  },

  // 로그아웃 처리
  logout: async (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.redirect('/');
    });
  },

  // 회원가입 페이지 로드
  accountPage: (req, res) => {
    res.render("account");
  },

  // 중복 이메일 찾기
  checkEmailDuplicate: async (req, res) => {
    const email = req.body.email;
    const user = await userModel.getUserByEmail(email);
    if (user) {
      return res.status(200).json({ isDuplicate: true });
    } else {
      return res.status(200).json({ isDuplicate: false });
    }
  },

  // 이메일 인증 번호 보내기
  emailAuth: async (req, res) => {
    const number = generateRandomNumber(111111, 999999);
    const email = req.body.email;

    const mailOptions = {
      from: "stopyun0101@naver.com", // 발신자 이메일 주소.
      to: email, // 사용자가 입력한 이메일 -> 목적지 주소 이메일
      subject: "인증 관련 메일 입니다.",
      html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
    };

    smtpTransport.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("메일 전송 에러:", err);
        res.status(500).json({ ok: false, msg: '메일 전송에 실패하였습니다. 다시 시도해 주세요.' });
      } else {
        console.log("메일 전송 성공:", response);
        res.json({ ok: true, msg: '메일 전송에 성공하였습니다.', authNum: number });
      }
      res.set('Cache-Control', 'no-store'); // 메일이 연속해서 안 보내지는 문제 해결을 위해 cache 초기화.
      smtpTransport.close(); // 전송 종료
    });
  },

  // 유저 가입 처리
  account: async (req, res) => {
    const { email, name, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 12);

    await userModel.createUser(email, name, hashedPassword);
    res.redirect("/login");
  }
};