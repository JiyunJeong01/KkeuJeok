const $form = document.querySelector('#form');
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm_password");
const emailError = document.querySelector("#email_error");
const passwordError = document.querySelector("#password_error");
const passwordConfirmError = document.querySelector("#password_confirm_error");

$form.addEventListener('submit', async function (event) {
    emailError.textContent = '';
    passwordError.textContent = '';

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!validateEmail(email)) {
        emailError.textContent = '이메일 형식이 올바르지 않습니다.';
        event.preventDefault();
        return;
    }

    if (!validatePassword(password)) {
        passwordError.textContent = '비밀번호는 8자 이상이어야 하며, 숫자와 문자를 포함해야 합니다.';
        event.preventDefault();
        return;
    }

    if (password !== confirmPassword) {
        passwordConfirmError.textContent = '비밀번호가 일치하지 않습니다.';
        event.preventDefault();
        return;
    }

    /*
    const isEmailDuplicate = await checkEmailDuplicate(email);
    if (isEmailDuplicate) {
        emailError.textContent = '이메일이 이미 사용 중입니다.';
        return;
    }
    */
   
    // 클라이언트 측에서 이미 유효성 검사를 하기 때문에, 서버의 response가 없어도 바로 리다이렉션 가능
    // 굳이 이런 방식 쓴 이유 = response를 받으려면 form action을 사용 못하고 자체적으로 fecth를 보내야 하는데 그게 번거로워 보여서...
    window.location.href = '/login';
});

// 이메일 검증 함수
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (emailPattern.test(email))
}

// 비밀번호 검증 함수
function validatePassword(password) {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    return (hasMinLength && hasNumber && hasLetter)
}

async function checkEmailDuplicate(email) {
    try {
        const response = await fetch("/check-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });
        const data = await response.json();
        return data.isDuplicate;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}