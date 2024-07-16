document.addEventListener('DOMContentLoaded', (event) => {
    const rememberCheck = document.getElementById('remember-check');

    // 쿠키에서 체크박스 상태를 읽어와 설정
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=').map(c => c.trim());
        acc[key] = value;
        return acc;
    }, {});

    if (cookies.savedEmail) {
        rememberCheck.checked = true; // savedEmail이 존재하면 체크박스 체크
    }
});