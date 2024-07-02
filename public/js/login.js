document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // 기본 동작(페이지 리로드) 방지
    const formData = new FormData(this); // 폼 데이터 가져오기

    try {
        const response = await fetch('/submit-login', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!data.ok) {
            alert("아이디와 비밀번호를 다시 확인해주세요.");
            window.location.href = '/login';
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error("Error:", error);
        alert("서버와의 통신 중 오류가 발생했습니다.");
    }
});