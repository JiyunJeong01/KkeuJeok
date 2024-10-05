const { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where, limit } = require('firebase/firestore');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const { db, storage } = require('../fbase');
const { v4: uuidv4 } = require('uuid');

// Firebase 다운로드 링크 판별 함수
function isFirebaseDownloadLink(url) {
    return url.startsWith('https://firebasestorage.googleapis.com/');
}

// 파일 업로드 및 Firestore에 이미지 정보 저장
exports.uploadFile = async (userId, memoId, files) => {
    try {
        // Firestore에서 해당 memoId에 이미 존재하는 파일들의 index 확인
        const filesQuery = query(
            collection(db, 'files'),
            where('memoId', '==', memoId),
            orderBy('index', 'desc'),
            limit(1)  // 가장 큰 index 값만 찾으면 되므로 1개만 가져옴
        );
        
        const querySnapshot = await getDocs(filesQuery);
        let lastIndex = 0; // 기존 파일이 없으면 0부터 시작

        // 만약 파일이 존재하면 가장 높은 index 값을 lastIndex로 설정
        if (!querySnapshot.empty) {
            const lastFile = querySnapshot.docs[0].data();
            lastIndex = lastFile.index; // 가장 큰 index 값
        }

        // Firebase Storage에서 파일 업로드
        const uploadTasks = files.map(async (file, index) => {
            const fileName = Buffer.from(file.originalname, 'ascii').toString('utf8');
            const type = file.mimetype;
            const uuid = uuidv4();
            
            // Firebase Storage에서 파일 업로드
            const fileRef = ref(storage, `${userId}/${uuid}_${fileName}`);
            await uploadBytes(fileRef, file.buffer);

            // 업로드된 파일의 다운로드 URL 가져오기
            const downloadURL = await getDownloadURL(fileRef);

            // Firestore에 파일 메타데이터 저장
            const fileMetadata = {
                memoId,
                fileName,
                type,
                uuid,
                index: lastIndex + index + 1,  // 기존 lastIndex에서 +1씩 증가
                downloadURL,
            };

            // 'files' 컬렉션에 새로운 파일 문서 추가
            const docRef = await addDoc(collection(db, 'files'), fileMetadata);

            return { fileId: docRef.id, downloadURL };
        });

        // 모든 파일 업로드 및 메타데이터 저장 작업을 병렬로 처리
        const results = await Promise.all(uploadTasks);
        return results;

    } catch (error) {
        console.error("파일 업로드 및 저장 중 오류:", error);
        throw error;
    }
}



// 메모 별 파일 정보 로딩
exports.getFilesByMemoId = async (memoId) => {
    try {
        const filesCollectionRef = collection(db, 'files');
        const q = query(filesCollectionRef, where('memoId', '==', memoId), orderBy('index'));
        const querySnapshot = await getDocs(q);

        const files = [];
        querySnapshot.forEach((doc) => {
            files.push({
                fileId: doc.id,
                fileName: doc.data().fileName,
                type: doc.data().type,
                uuid: doc.data().uuid,
                index: doc.data().index,
                downloadURL: doc.data().downloadURL,
            });
        });

        return files;
    } catch (error) {
        console.error("파일 가져오기 중 오류:", error);
        throw error;
    }
}

// 메모 별 파일 수정
exports.modifiedFiles = async (userId, memoId, takeFiles) => {
    const files = await exports.getFilesByMemoId(memoId);
    const storageDeletePromises = [];
    const firestoreDeletePromises = [];

    files.forEach(file => {
        // Firebase Storage에서 파일 삭제
        if (isFirebaseDownloadLink(file.downloadURL)) {
            const fileRef = ref(storage, `${userId}/${file.fileName}`);
            storageDeletePromises.push(deleteObject(fileRef));
        }

        // Firebase Firestore에서 파일 문서 삭제 (Firebase 다운로드 링크인 것은 제외)
        const fileDocRef = doc(db, 'files', file.id);
        if (!isFirebaseDownloadLink(file.downloadURL)) {
            firestoreDeletePromises.push(deleteDoc(fileDocRef));
        }
    });

    // 동시에 모든 작업을 실행하고 완료를 기다린다.
    await Promise.all(storageDeletePromises);
    await Promise.all(firestoreDeletePromises);

    const newFile = takeFiles.filter(file => !isFirebaseDownloadLink(file));
    await uploadFile(userId, memoId, newFile);

}

// 메모 수정 시 특정 파일 삭제
exports.deleteOneFile = async (memoId, index, userId) => {
    try {
        const parsedIndex = parseInt(index, 10);
        const fileSnapshot = await getDocs(
            query(
                collection(db, 'files'),
                where('memoId', '==', memoId),
                where('index', '==', parsedIndex)));

        const file = fileSnapshot.docs[0].data();

        const fileRef = ref(storage, `${userId}/${file.uuid}_${file.fileName}`);
        await deleteObject(fileRef);
        await deleteDoc(fileSnapshot.docs[0].ref);
        return file;
    } catch (error) {
        console.error('이미지 삭제 중 오류:', error);
        throw error;
    }
}

// 메모 삭제와 관련된 파일 삭제
exports.deleteFiles = async (userId, memoId) => {
    try {
        // 메모와 관련된 파일 정보 가져오기
        const files = await exports.getFilesByMemoId(memoId);

        // Firebase Storage에서 파일 삭제
        const deletePromises = files.map(async (file) => {
            const fileRef = ref(storage, `${userId}/${file.uuid}_${file.fileName}`);
            await deleteObject(fileRef);
        });
        await Promise.all(deletePromises);

        // Firestore에서 파일 문서 삭제
        const filesCollectionRef = collection(db, 'files');
        const q = query(filesCollectionRef, where('memoId', '==', memoId));
        const querySnapshot = await getDocs(q);
        const deleteFileDocsPromises = [];
        querySnapshot.forEach((doc) => {
            deleteFileDocsPromises.push(deleteDoc(doc.ref));
        });
        await Promise.all(deleteFileDocsPromises);
    } catch (error) {
        console.error("메모와 파일 삭제 중 오류:", error);
        throw error;
    }
}

// 여러 memoId에 해당하는 파일들을 삭제하는 함수
exports.deleteFilesByMemoIds = async (userId, memoIds) => {
    try {
        const deletionPromises = [];

        // 각 memoId에 대해 파일 삭제 작업 수행
        for (const memoId of memoIds) {
            // 메모와 관련된 파일 정보 가져오기
            const files = await exports.getFilesByMemoId(memoId);

            // Firebase Storage에서 파일 삭제
            const deleteStoragePromises = files.map(async (file) => {
                const fileRef = ref(storage, `${userId}/${file.uuid}_${file.fileName}`);
                await deleteObject(fileRef);
            });
            deletionPromises.push(Promise.all(deleteStoragePromises));

            // Firestore에서 파일 문서 삭제
            const filesCollectionRef = collection(db, 'files');
            const q = query(filesCollectionRef, where('memoId', '==', memoId));
            const querySnapshot = await getDocs(q);
            const deleteFileDocsPromises = querySnapshot.docs.map(async (doc) => {
                await deleteDoc(doc.ref);
            });
            deletionPromises.push(Promise.all(deleteFileDocsPromises));
        }

        // 모든 삭제 작업을 기다림
        await Promise.all(deletionPromises);
    } catch (error) {
        console.error("파일 삭제 중 오류:", error);
        throw error;
    }
}