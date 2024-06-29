const form = document.querySelector('#form');
const emailInput = document.querySelector("#email");
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

form.addEventListener('submit', async function(event) {
    const emailValid = validateEmail();
    const nameValid = validateName();
    const passwordValid = validatePassword();
    const passwordsMatch = comparePasswords();

    if (!emailValid || !nameValid || !passwordValid || !passwordsMatch) {
        event.preventDefault();
    }

    /*
    const isEmailDuplicate = await checkEmailDuplicate(emailInput.value);
    if (isEmailDuplicate) {
        emailError.textContent = '이메일이 이미 사용 중입니다.';
        emailError.style.display = 'inline';
        event.preventDefault();
        return;
    }
    */
});

function validateEmail() {
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
    } else {
        emailError.style.display = 'none';
        return true;
    }
}

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