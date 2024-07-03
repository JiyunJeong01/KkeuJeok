const { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where } = require('firebase/firestore');
const { ref, uploadBytes, getDownloadURL, uploadString } = require('firebase/storage');
const { db, storage } = require('../fbase');
const { v4: uuidv4 } = require('uuid');

// 랜덤 문자열 생성 함수
function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 파일 업로드 및 Firestore에 파일 정보 저장
exports.uploadFile = async (userId, memoId, files) => {
    try {
        const uploadTasks = files.map(async (file) => {

            // Firebase Storage에서 파일 업로드
            const storageRef = ref(storage, `${userId}/${uuidv4()}`);

            await uploadString(storageRef, file, 'data_url');

            // 업로드된 파일의 다운로드 URL 가져오기
            const downloadURL = await getDownloadURL(storageRef);

            // Firestore에 파일 메타데이터 저장
            const fileMetadata = {
                memoId,
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
        const q = query(filesCollectionRef, where('memoId', '==', memoId));
        const querySnapshot = await getDocs(q);

        const files = [];
        querySnapshot.forEach((doc) => {
            files.push({
                fileId: doc.id,
                fileName: doc.data().fileName,
                downloadURL: doc.data().downloadURL,
            });
        });

        return files;
    } catch (error) {
        console.error("파일 가져오기 중 오류:", error);
        throw error;
    }
}

// 메모 삭제와 관련된 파일 삭제
exports.deleteMemoAndFiles = async (memoId) => {
    try {
        // 메모와 관련된 파일 정보 가져오기
        const files = await exports.getFilesByMemoId(memoId);

        // Firebase Storage에서 파일 삭제
        const deletePromises = files.map(async (file) => {
            const fileRef = storage.file(`files/${file.fileName}`);
            await fileRef.delete();
        });
        await Promise.all(deletePromises);

        // Firestore에서 파일 문서 삭제
        const filesCollectionRef = collection(db, 'files');
        const q = query(filesCollectionRef, where('memoId', '==', memoId));
        const querySnapshot = await getDocs(q);
        const deleteFileDocsPromises = [];
        querySnapshot.forEach((doc) => {
            deleteFileDocsPromises.push(doc.ref.delete());
        });
        await Promise.all(deleteFileDocsPromises);

        // Firestore에서 메모 문서 삭제
        const memoRef = db.collection('memos').doc(memoId);
        await memoRef.delete();

        console.log(`메모와 관련 파일이 성공적으로 삭제되었습니다: ${memoId}`);
    } catch (error) {
        console.error("메모와 파일 삭제 중 오류:", error);
        throw error;
    }
}