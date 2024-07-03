// timestamp를 형식에 맞게 변환
function formatTimeStamp(timeStamp, dateSeparator = "-", timeSeparator = ":") {
    var date = new Date(timeStamp* 1000); // 타임스탬프를 인자로 받아 Date 객체 생성

    // 생성한 Date 객체에서 년, 월, 일, 시, 분, 초를 각각 문자열로 추출
    var year   = date.getFullYear().toString();           // 년도
    var month  = ("0" + (date.getMonth() + 1)).slice(-2); // 월 2자리 (01, 02 ... 12)
    var day    = ("0" + date.getDate()).slice(-2);        // 일 2자리 (01, 02 ... 31)
    var hour   = ("0" + date.getHours()).slice(-2);       // 시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2);     // 분 2자리 (00, 01 ... 59)
    var second = ("0" + date.getSeconds()).slice(-2);     // 초 2자리 (00, 01 ... 59)

    // 형식화된 문자열 생성
    var formattedDateTime = `${year}${dateSeparator}${month}${dateSeparator}${day} ${hour}${timeSeparator}${minute}${timeSeparator}${second}`;

    return formattedDateTime;
}

// 사용자가 내용을 올바르게 입력하였는지 확인합니다.
function isValidcontent(content) {
    if (content == '') {
        alert('내용을 입력해주세요');
        return false;
    }
    if (content.trim().length > 140) {
        alert('공백 포함 140자 이하로 입력해주세요');
        return false;
    }
    return true;
}

// 북마크를 진행합니다.
function bookmark(id) {
    $(`#${id}-unbookmark`).css('display', 'block');
    $(`#${id}-bookmark`).css('display', 'none');

    
    let data = { 'id' : id };

    fetch(`/bookmark/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        
}

// 언북마크를 진행합니다.
function unBookmark(id) {
    $(`#${id}-unbookmark`).css('display', 'none');
    $(`#${id}-bookmark`).css('display', 'block');

    
    let data = { 'id' : id };

    fetch(`/un-bookmark/${id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        
}

// 수정 버튼을 눌렀을 때, 기존 작성 내용을 textarea 에 전달합니다.
// 숨길 버튼을 숨기고, 나타낼 버튼을 나타냅니다.
function editPost(id) {
    showEdits(id);
    let content = $(`#${id}-content`).text().trim();
    $(`#${id}-textarea`).val(content);
}

function showEdits(id) {
    $(`#${id}-editarea`).show();
    $(`#${id}-submit`).show();
    $(`#${id}-delete`).show();

    $(`#${id}-content`).hide();
    $(`#${id}-edit`).hide();
}

// 메모를 생성합니다.
function writePost() {
    // 1. 작성한 메모를 불러옵니다.
    let content = $('#content').val();

    // 2. 작성한 메모가 올바른지 isValidcontent 함수를 통해 확인합니다.
    if (isValidcontent(content) == false) {
        return;
    }

    // 3. 전달할 data JSON으로 만듭니다.
    let data = { 'content': content };

    // 4. POST memo 에 data를 전달합니다.
    fetch('/memo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(data => {
        alert('메시지가 성공적으로 작성되었습니다.');
        window.location.reload();
    })
}

// 메모를 수정합니다.
function submitEdit(memoId) {
    // 1. 작성 대상 메모의 content 를 확인합니다.
    let content = $(`#${memoId}-textarea`).val().trim();

    // 2. 작성한 메모가 올바른지 isValidcontent 함수를 통해 확인합니다.
    if (isValidcontent(content) == false) {
        return;
    }

    // 3. 전달할 data JSON으로 만듭니다.
    let data = { 'content': content };

    // 4. PUT /memo/{memoId} 에 data를 전달합니다.
    fetch(`/memo/${memoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(data => {
        alert('메시지가 성공적으로 작성되었습니다.');
        window.location.reload();
    })
}

// 메모를 삭제합니다.
function deleteOne(memoId) {
    // 1. DELETE /memo/{id} 에 요청해서 메모를 삭제합니다.
    fetch(`/memo/${memoId}`, {
        method: 'DELETE',
    }).then(data => {
        alert('메시지 삭제에 성공하였습니다.');
        window.location.reload();
    })
}