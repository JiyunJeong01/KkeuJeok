const form = document.querySelector('#form');
const emailInput = document.querySelector("#email");
const emailCheck = document.querySelector("#check_email");
const nameInput = document.querySelector("#name");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm_password");
const emailError = document.querySelector("#email_error");
const nameError = document.querySelector("#name_error");
const passwordError = document.querySelector("#password_error");
const passwordConfirmError = document.querySelector("#password_confirm_error");

emailInput.addEventListener('blur', validateEmail);
nameInput.addEventListener('blur', validateName);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', comparePasswords);

form.addEventListener('submit', async function (event) {
    // 비동기 함수들을 병렬로 실행하여 각각의 Promise를 생성
    const emailPromise = validateEmail();
    const namePromise = validateName();
    const passwordPromise = validatePassword();
    const passwordsMatchPromise = comparePasswords();

    // 각 Promise가 완료될 때까지 기다리지 않고 동시에 시작
    const emailValid = await emailPromise;
    const nameValid = await namePromise;
    const passwordValid = await passwordPromise;
    const passwordsMatch = await passwordsMatchPromise;

    if (!emailValid || !nameValid || !passwordValid || !passwordsMatch) {
        event.preventDefault();
    }
});

// 이메일 형식 체크
async function validateEmail() {
    const email = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        emailError.textContent = '이메일을 입력해 주세요.';
        emailError.style.display = 'inline';
        return false;
    }
    else if (!emailPattern.test(email)) {
        emailError.textContent = '이메일 형식이 올바르지 않습니다.';
        emailError.style.display = 'inline';
        return false;
    } 
    // await이 없으면 promise를 반환한다. promise가 아니라 value를 받기 위해서 await을 걸었다.
    else if (await checkEmailDuplicate(email)) {
        emailError.textContent = '사용 중인 이메일입니다.';
        emailError.style.display = 'inline';
        return false;
    }
    else {
        emailError.style.display = 'none';
        return true;
    }
}

// 이메일 중복 체크
async function checkEmailDuplicate(email) {
    const data = { 'email': email };
    const response = await fetch("/check-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const isDuplicate = await response.json();
    return isDuplicate.isDuplicate;
}

// 이름 형식 체크
async function validateName() {
    const name = nameInput.value;

    if (!name) {
        nameError.textContent = '이름을 입력해 주세요.';
        nameError.style.display = 'inline';
        return false;
    } else {
        nameError.style.display = 'none';
        return true;
    }
}

// 비밀번호 형식 체크
async function validatePassword() {
    const password = passwordInput.value;
    const hasMinLength = password.length >= 8 && password.length <= 16;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    if (!password) {
        passwordError.textContent = '비밀번호를 입력해 주세요.';
        passwordError.style.display = 'inline';
        return false;
    }
    else if (!(hasMinLength && hasNumber && hasLetter)) {
        passwordError.textContent = '8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.';
        passwordError.style.display = 'inline';
        return false;
    } else {
        passwordError.style.display = 'none';
        return true;
    }
}

// 비밀번호 일치 확인
async function comparePasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!confirmPassword) {
        passwordConfirmError.textContent = '비밀번호 확인을 입력해 주세요.';
        passwordConfirmError.style.display = 'inline';
        return false;
    }
    else if (password !== confirmPassword) {
        passwordConfirmError.textContent = '비밀번호가 일치하지 않습니다.';
        passwordConfirmError.style.display = 'inline';
        return false;
    } else {
        passwordConfirmError.style.display = 'none';
        return true;
    }
}