//main.js
const express = require("express"), //애플리케이션에 express 모듈 추가
layouts = require("express-ejs-layouts"), //모듈 설치
methodOverride = require("method-override"),
homeRouter = require('./routers/homeRouter');

app = express(); //app에 express 웹 서버 애플리케이션 할당
app.use(layouts); //레이아웃 사용
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));

app.set("port", process.env.PORT || 80); //포트 80으로 연결 셋팅
app.set("view engine", "ejs"); //뷰 엔진을 ejs로 설정

app.use("/", homeRouter);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
}); //최종적으로 제대로 작동하는지 확인 