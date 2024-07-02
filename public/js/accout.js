const form = document.querySelector('#form');
const emailInput = document.querySelector("#email");
const emailBtn = document.getElementById("email_btn");
const emailCheckInput = document.querySelector("#check_email");
const checkEmailBtn = document.getElementById("check_email_btn");

// 인증번호 저장 변수
let authNum; 

const nameInput = document.querySelector("#name");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm_password");

const emailError = document.querySelector("#email_error");
const emailCheckError = document.querySelector("#email_check_error");
const nameError = document.querySelector("#name_error");
const passwordError = document.querySelector("#password_error");
const passwordConfirmError = document.querySelector("#password_confirm_error");

emailInput.addEventListener('blur', validateEmail);
nameInput.addEventListener('blur', validateName);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', comparePasswords);

form.addEventListener('submit', async function (event) {
    event.preventDefault(); // 기본 동작(페이지 새로고침)을 막습니다.

    const emailValid = await validateEmail();
    const emailCehck = checkAuthCode();
    const nameValid = validateName();
    const passwordValid = validatePassword();
    const passwordsMatch = comparePasswords();

    if (emailValid && emailCehck && nameValid && passwordValid && passwordsMatch) {
        form.submit(); // 모든 유효성 검사를 통과하면 폼을 제출합니다.
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
function validateName() {
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
function validatePassword() {
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
function comparePasswords() {
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

// 이메일 인증 보내기
async function sendAuthEmail() {
    const email = emailInput.value;

    // 이메일이 입력되었는지 확인
    if (!email) {
        return;
    }

    // 이메일 인증번호 요청
    try {
        console.log(email)
        const data = { 'email': email };
        const response = await fetch("/auth-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json();
        if (result.ok) {
            alert("인증번호가 발송되었습니다.");
            authNum = result.authNum;
            emailCheckInput.disabled = false;
            checkEmailBtn.classList.remove("disabled-button");
            checkEmailBtn.style.pointerEvents = 'auto'; // 클릭 이벤트 활성화
        } else {
            emailError.textContent = result.msg;
        }
    } catch (error) {
        console.error("Error:", error);
        emailError.textContent = "인증번호 발송에 실패하였습니다.";
    }
};

function checkAuthCode() {
    const checkEmail = emailCheckInput.value;

    // 인증번호가 입력되었는지 확인
    if (!checkEmail) {
        emailCheckError.textContent = "인증번호를 입력해주세요.";
        emailCheckError.style.display = 'inline';
        return;
    }

    // 인증번호 확인 로직
    // checkEmail은 string이고 authNum은 int타입이라 == 사용
    if (checkEmail == authNum) {
        alert("인증번호 확인이 완료되었습니다.")
        emailCheckError.style.display = 'none';
        return true;
    } else {
        emailCheckError.textContent = '인증번호를 다시 확인해주세요.';
        emailCheckError.style.display = 'inline';
        return false;
    }

}