
// 사용자가 내용을 올바르게 입력하였는지 확인합니다.
function isValidContents(contents) {
    if (contents == '') {
        alert('내용을 입력해주세요');
        return false;
    }
    if (contents.trim().length > 140) {
        alert('공백 포함 140자 이하로 입력해주세요');
        return false;
    }
    return true;
}

// 수정 버튼을 눌렀을 때, 기존 작성 내용을 textarea 에 전달합니다.
// 숨길 버튼을 숨기고, 나타낼 버튼을 나타냅니다.
function editPost(id) {
    showEdits(id);
    let contents = $(`#${id}-contents`).text().trim();
    $(`#${id}-textarea`).val(contents);
}

function showEdits(id) {
    $(`#${id}-editarea`).show();
    $(`#${id}-submit`).show();
    $(`#${id}-delete`).show();

    $(`#${id}-contents`).hide();
    $(`#${id}-edit`).hide();
}

// 메모를 생성합니다.
function writePost() {
    // 1. 작성한 메모를 불러옵니다.
    let contents = $('#contents').val();

    // 2. 작성한 메모가 올바른지 isValidContents 함수를 통해 확인합니다.
    if (isValidContents(contents) == false) {
        return;
    }

    // 3. 전달할 data JSON으로 만듭니다.
    let data = { 'userId': 'test', 'content': contents };

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
    // 1. 작성 대상 메모의 contents 를 확인합니다.
    let contents = $(`#${memoId}-textarea`).val().trim();

    // 2. 작성한 메모가 올바른지 isValidContents 함수를 통해 확인합니다.
    if (isValidContents(contents) == false) {
        return;
    }

    // 3. 전달할 data JSON으로 만듭니다.
    let data = { 'content': contents };

    // 4. PUT /memos/{memoId} 에 data를 전달합니다.
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