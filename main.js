const express = require("express"), //애플리케이션에 express 모듈 추가
  layouts = require("express-ejs-layouts"), //모듈 설치
  methodOverride = require("method-override"),
  bodyParser = require('body-parser'),
  session = require('express-session');

app = express(); // app에 express 웹 서버 애플리케이션 할당
require('dotenv').config();

/////////////////////////////////////////
// 세션 설정
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 테스트 : 세션 확인
app.get('/session-data', (req, res) => {
  if (req.session.user) {
    res.json({
      message: '세션 데이터가 있습니다.',
      user: req.session.user
    });
  } else {
    res.json({
      message: '세션 데이터가 없습니다.'
    });
  }
});
/////////////////////////////////////////


// JSON데이터의 최대 크기 설정
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// 레이아웃 설정
app.use(layouts);
app.use(express.static("public"));


// 데이터 요청 및 파싱 처리
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


/////////////////////////////////////////
// 라우트 설정
const homeRouter = require('./routers/homeRouter');
const memoRouter = require('./routers/memoRouter');

app.use("/home", homeRouter);
app.use("/", memoRouter);
/////////////////////////////////////////

// 포트 및 뷰 엔진 설정
app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");


// 최종적으로 제대로 작동하는지 확인 
app.listen(app.get("port"), () => {
  console.log(
    "두다다다다다다다\n" +
    "두다다다다다다다\n" +
    "　(∩`・ω・)\n" +
    "＿/_ミつ/￣￣￣/\n" +
    "　　＼/＿＿＿/\n"
  )
  console.log(`Server running at http://localhost:${app.get("port")}`);
});