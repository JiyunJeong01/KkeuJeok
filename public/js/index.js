// timestamp를 형식에 맞게 변환
function formatTimeStamp(timeStamp, dateSeparator = "-", timeSeparator = ":") {
    var date = new Date(timeStamp * 1000); // 타임스탬프를 인자로 받아 Date 객체 생성

    // 생성한 Date 객체에서 년, 월, 일, 시, 분, 초를 각각 문자열로 추출
    var year = date.getFullYear().toString();           // 년도
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 월 2자리 (01, 02 ... 12)
    var day = ("0" + date.getDate()).slice(-2);        // 일 2자리 (01, 02 ... 31)
    var hour = ("0" + date.getHours()).slice(-2);       // 시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2);     // 분 2자리 (00, 01 ... 59)
    var second = ("0" + date.getSeconds()).slice(-2);     // 초 2자리 (00, 01 ... 59)

    // 형식화된 문자열 생성
    var formattedDateTime = `${year}${dateSeparator}${month}${dateSeparator}${day} ${hour}${timeSeparator}${minute}${timeSeparator}${second}`;

    return formattedDateTime;
}

// 텍스트에리어 자동 높이 조절
document.addEventListener('DOMContentLoaded', function () {
    var textareas = document.querySelectorAll('textarea');

    textareas.forEach(function (textarea) {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
});

// 북마크를 진행합니다.
function bookmark(id) {
    $(`#${id}-unbookmark`).css('display', 'block');
    $(`#${id}-bookmark`).css('display', 'none');


    let data = { 'id': id };

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


    let data = { 'id': id };

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

    // 이미지 편집 모드로 전환
    /* 수정 기능 보류
    const imageContainer = document.getElementById(`${id}-imageContainer`);
    const imageCols = imageContainer.querySelectorAll('.input-col');
    imageCols.forEach(col => {
        const img = col.querySelector('img');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('xi-close');
        closeIcon.onclick = function() {
            removeImage(img);
        };
        col.appendChild(closeIcon);
    });
    */

    let content = $(`#${id}-content`).text().trim();
    $(`#${id}-textarea`).val(content);
}

function showEdits(id) {
    $(`#${id}-editarea`).show();
    $(`#${id}-submit`).show();
    $(`#${id}-delete`).show();
    $(`#${id}-image`).hide(); // 수정 기능 보류
    $(`#${id}-file`).hide(); // 수정 기능 보류

    $(`#${id}-content`).hide();
    $(`#${id}-edit`).hide();
}

// 이미지 input을 form에 추가합니다.
function imageInput() {
    const form = document.getElementById('postForm');

    const input = document.createElement('input');
    input.type = 'file';
    input.id = "imageInput";
    input.accept = 'image/*';
    input.style.display = 'none';
    input.name = `files`;

    input.onchange = function (event) {
        handleImageUpload(event.target.files, 'imageContainer', 'fileContainer', input);
    };

    form.appendChild(input); // input 요소를 컨테이너에 추가
    input.click();
}

// 이미지를 미리보기를 imageContainer 안에 추가합니다.
function handleImageUpload(files, imageContainerId, fileContainerId, inputElement) {
    const maxImages = 4; // 최대 이미지 수
    const imageContainer = document.getElementById(imageContainerId);
    const fileContainer = document.getElementById(fileContainerId); // 현재 추가된 파일

    // 이미 추가된 이미지 수를 계산
    const imageCount = imageContainer.querySelectorAll('.col').length;

    // 최대 이미지 수를 초과한 경우 알림
    const remainingSlots = maxImages - imageCount;
    if (files.length > remainingSlots) {
        alert(`이미지는 최대 ${maxImages}개까지 추가할 수 있습니다.`);
        return;
    }

    // 파일과 이미지를 동시에 추가할 수 없도록 체크
    if (fileContainer.querySelector('.col')) {
        alert(`파일과 이미지를 동시에 추가할 수 없습니다.`);
        return;
    }

    // 파일들을 처리하는 함수
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageUrl = event.target.result;

            // 이미지 wrapper 생성
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('col', 'input-col');

            // 이미지 엘리먼트 생성
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;

            // 이미지 제거 아이콘 생성
            const removeIcon = document.createElement('i');
            removeIcon.classList.add('xi-close');
            removeIcon.onclick = function () {
                removeImage(imageWrapper, inputElement);
            };

            imageWrapper.appendChild(imageElement);
            imageWrapper.appendChild(removeIcon);
            imageContainer.appendChild(imageWrapper);
        };

        // 파일을 읽어들임
        reader.readAsDataURL(file);
    });
}

// 이미지 삭제
function removeImage(imageWrapper, inputElement) {
    imageWrapper.parentElement.removeChild(imageWrapper);
    inputElement.parentNode.removeChild(inputElement);
}

// 파일 input을 form에 추가합니다.
function fileInput() {
    const form = document.getElementById('postForm');

    const input = document.createElement('input');
    input.type = 'file';
    input.id = "fileInput";
    input.style.display = 'none';
    input.name = `files`;

    input.onchange = function (event) {
        handleFileUpload(event.target.files, 'fileContainer', 'imageContainer', input);
    };

    form.appendChild(input); // input 요소를 컨테이너에 추가
    input.click();
}

// 파일 이미지를 container 안에 추가합니다.
function handleFileUpload(file, fileContainerId, imageContainerId, inputElement) {
    const fileContainer = document.getElementById(fileContainerId);
    const imageContainer = document.getElementById(imageContainerId);

    if (fileContainer.querySelector('.col')) {
        alert('파일은 1개까지 추가할 수 있습니다.');
        return;
    }
    if (imageContainer.querySelector('.col')) {
        alert(`파일과 이미지를 동시에 추가할 수 없습니다.`);
        return;
    }

    const fileWrapper = document.createElement('div');
    fileWrapper.classList.add('col', 'input-col', 'file-col');

    const imageElement = document.createElement('i');
    imageElement.classList.add('xi-file-download-o', 'xi-2x');

    const fileNameElement = document.createElement('span');
    fileNameElement.classList.add('file-name');
    fileNameElement.textContent = file[0].name;

    const removeIcon = document.createElement('i');
    removeIcon.classList.add('xi-close');
    removeIcon.onclick = function () {
        removeFile(fileWrapper, inputElement);
    };

    fileWrapper.appendChild(imageElement);
    fileWrapper.appendChild(removeIcon);
    fileWrapper.appendChild(fileNameElement);
    fileContainer.appendChild(fileWrapper);
};


// 파일을 삭제합니다.
function removeFile(fileWrapper, inputElement) {
    fileWrapper.parentNode.removeChild(fileWrapper);
    inputElement.parentNode.removeChild(inputElement);
}

// 메모를 수정합니다.
function submitEdit(memoId) {
    // 1. 작성 대상 메모의 content 를 확인합니다.
    let content = $(`#${memoId}-textarea`).val().trim();

    var imgSources = [];
    $(`#${memoId}-imageContainer .input-col`).each(function () {
        var img = $(this).find('img');
        imgSources.push(img.attr('src'));
    });

    // 2. 작성한 메모가 올바른지 isValidcontent 함수를 통해 확인합니다.
    if (isValidcontent(content) == false) {
        return;
    }

    // 3. 전달할 data JSON으로 만듭니다.
    let data = { 'content': content, 'imgSources': imgSources };

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
