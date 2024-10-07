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

// 이미지 클릭 시 큰 팝업창 보이게 하기.
function imageShow(src) {
    const img = document.getElementById('image-box-content');
    const imageBox = document.getElementById('image-box');
    imageBox.style.display = 'flex';
    img.src = src;
}

// 팝업창 클릭시 없애기
function imageClose(src) {
    const img = document.getElementById('image-box-content');
    const imageBox = document.getElementById('image-box');
    imageBox.style.display = 'none';
    img.src = '';
}

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

    const imageContainer = document.getElementById(`${id}-imageContainer`);
    const imageCols = imageContainer.querySelectorAll('.input-col');
    imageCols.forEach(col => {
        const img = col.querySelector('img');
        const index = col.getAttribute('data-index');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('xi-close');
        closeIcon.onclick = function() {
            removeImage(img, col);
            deleteImageFromDB(index, id);
        };
        col.appendChild(closeIcon);
    });

    const fileContainer = document.getElementById(`${id}-fileContainer`);
    const fileCol = fileContainer.getElementsByClassName('input-col')[0];
    const file = fileContainer.querySelector('a');
    const index = 1;
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('xi-close');
    closeIcon.onclick = function() {
        removeFile(file,fileContainer);
        deleteImageFromDB(index, id);
    };
    file.onclick = function(event) {
        event.preventDefault();
    };
    fileCol.appendChild(closeIcon);

    let content = $(`#${id}-content`).text().trim();
    $(`#${id}-textarea`).val(content);
}

function showEdits(id) {
    $(`#${id}-editarea`).show();
    $(`#${id}-submit`).show();
    $(`#${id}-delete`).show();
    $(`#${id}-image`).show();
    $(`#${id}-file`).show();

    $(`#${id}-content`).hide();
    $(`#${id}-edit`).hide();
}

// 이미지 input을 form에 추가합니다.
function imageInput(imageContainerId, fileContainerId, memoId = 'postForm') {
    // memoId가 'postForm'이면 처음 작성하는 경우로 기본 폼을 사용
    if (memoId === 'postForm') {
        form = document.getElementById('postForm');
    } 
    // memoId가 있으면 해당 메모의 컨텐츠를 위한 폼으로 사용
    else {
        form = document.getElementById(`${memoId}-content`);
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.id = `${memoId}-imageInput`;
    input.className = `${memoId}-imageInput`;
    input.accept = 'image/*';
    input.style.display = 'none';
    input.name = `files`;

    input.onchange = function (event) {
        handleImageUpload(event.target.files, imageContainerId, fileContainerId, input);
    };

    form.appendChild(input);  // input 요소를 form에 추가
    input.click();  // 파일 선택 창을 띄움
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
            imageWrapper.classList.add('col', 'input-col', 'file-view');

            // 이미지 엘리먼트 생성
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageElement.alt = file.name;

            // 이미지 제거 아이콘 생성
            const removeIcon = document.createElement('i');
            removeIcon.classList.add('xi-close');
            removeIcon.onclick = function () {
                removeImage(imageWrapper, inputElement);  // 이미지 제거 함수 호출
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

// 서버에 DELETE 요청을 보내서 DB에서 이미지 삭제
function deleteImageFromDB(index,id) {
    fetch(`/memo/${id}/${index}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 파일 input을 form에 추가합니다.
function fileInput(imageContainerId, fileContainerId, memoId = 'postForm') {
    // memoId가 'postForm'이면 처음 작성하는 경우로 기본 폼을 사용
    if (memoId === 'postForm') {
        form = document.getElementById('postForm');
    } 
    // memoId가 있으면 해당 메모의 컨텐츠를 위한 폼으로 사용
    else {
        form = document.getElementById(`${memoId}-content`);
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.id = `${memoId}-fileInput`;
    input.style.display = 'none';
    input.name = `files`;

    input.onchange = function (event) {
        handleFileUpload(event.target.files, fileContainerId, imageContainerId, input);
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
    
    // 2. 수정할 파일 input을 가져옵니다.
    let imageInputs = document.querySelectorAll(`.${memoId}-imageInput`);
    let fileInput = document.getElementById(`${memoId}-fileInput`);

    // 3. FormData 객체를 만듭니다.
    let formData = new FormData();

    // 4. 텍스트 내용을 추가합니다.
    formData.append('content', content);

    // 5. 이미지 파일이 있다면 files로 추가합니다.
    imageInputs.forEach(input => {
        if (input.files.length > 0) {
            for (let i = 0; i < input.files.length; i++) {
                formData.append('files', input.files[i]);
            }
        }
    });

    // 6. 일반 파일이 있다면 files로 추가합니다.
    if (fileInput && fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('files', fileInput.files[i]);
        }
    }

    // 7. PUT /memo/{memoId} 에 formData를 전달합니다.
    fetch(`/memo/${memoId}`, {
        method: 'PUT',
        body: formData
    }).then(response => {
        if (response.ok) {
            alert('메시지가 성공적으로 수정되었습니다.');
            window.location.reload();
        } else {
            alert('수정 중 문제가 발생했습니다.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('수정 중 문제가 발생했습니다.');
    });
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
