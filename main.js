const express = require("express"), //애플리케이션에 express 모듈 추가
  layouts = require("express-ejs-layouts"), //모듈 설치
  methodOverride = require("method-override"),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cookieParser = require('cookie-parser');

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

// Method Override 설정
app.use(methodOverride('_method'));

// 쿠키 사용
app.use(cookieParser());

// JSON 데이터의 최대 크기 설정
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 레이아웃 설정
app.use(layouts);
app.use(express.static("public"));

// 데이터 요청 및 파싱 처리
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/////////////////////////////////////////
// 라우트 설정
const homeRouter = require('./routers/homeRouter');
const memoRouter = require('./routers/memoRouter');
const authRouter = require('./routers/authRouter');
const settingRouter = require('./routers/settingRouter');

app.use("/home", homeRouter);
app.use("/", memoRouter);
app.use("/", authRouter);
app.use("/setting", settingRouter);
/////////////////////////////////////////


// 에러 핸들링 추가
const errorController = require('./controllers/errorController');
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

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