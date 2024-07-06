const { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where } = require('firebase/firestore');
const { db } = require('../fbase');
const { getFilesByMemoId } = require('./File');
// 전체 게시글 조회
exports.findAll = async () => {
    try {
        // 'memos' 컬렉션의 모든 문서를 가져옴
        const querySnapshot = await getDocs(
            query(
                collection(db, 'memos'),
                orderBy('createdAt', 'desc')));
        const memos = [];
        querySnapshot.forEach((memo) => {
            // 각 문서 데이터를 객체로 변환하여 배열에 추가
            memos.push({
                id: memo.id,
                ...memo.data()
            });
        });
        return memos;
    } catch (error) {
        console.log("findAll 실행 중 오류:", error);
        throw error;
    }
}

// 특정 id의 게시글 조회
exports.findByUserId = async (userId) => {
    try {
        // 'memos' 컬렉션에서 특정 userID를 가진 게시글만 가져옴
        const querySnapshot = await getDocs(
            query(
                collection(db, 'memos'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')));

        // 각 게시글과 관련된 파일 정보를 포함한 배열 반환
        const memos = await Promise.all(querySnapshot.docs.map(async (memo) => {
            const files = await getFilesByMemoId(memo.id);
            return {
                id: memo.id,
                ...memo.data(),
                files: files,
            };
        }));
        return memos;
    } catch (error) {
        console.log("findByUserId 실행 중 오류:", error);
        throw error;
    }
}

// 검색된 게시글 조회
exports.searchMemo = async (userId, queryString) => {
    try {
        // 'memos' 컬렉션에서 특정 userId를 가지며, content에 queryString이 포함된 게시글만 가져옴
        const querySnapshot = await getDocs(
            query(
                collection(db, 'memos'),
                where('userId', '==', userId),
                where('content', '>=', queryString),
                where('content', '<=', queryString + '\uf8ff'),
                orderBy('createdAt', 'desc')
            )
        );

        // 각 게시글과 관련된 파일 정보를 포함한 배열 반환
        const memos = await Promise.all(querySnapshot.docs.map(async (memo) => {
            const files = await getFilesByMemoId(memo.id);
            return {
                id: memo.id,
                ...memo.data(),
                files: files,
            };
        }));
        return memos;
    } catch (error) {
        console.log("searchMemo 실행 중 오류:", error);
        throw error;
    }
}

// memo 추가
exports.createMemo = async (userId, content) => {
    try {
        const timestamp = new Date(); // 현재 타임스탬프

        // 새로운 메모 객체 생성
        const memoData = {
            userId,
            content,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        // 'memos' 컬렉션에 새로운 메모 문서 추가
        const docRef = await addDoc(collection(db, 'memos'), memoData);

        console.log("메모가 추가되었습니다. ID:", docRef.id);

        return docRef.id; // 새로 추가된 메모의 ID 반환
    } catch (error) {
        console.error("메모 추가 중 오류:", error);
        throw error;
    }
}

// memo 수정
exports.modifiedMemo = async (memoId, newContent) => {
    try {
        const timestamp = new Date();
        const memoRef = doc(db, 'memos', memoId);
        // 업데이트할 데이터 객체 생성
        const updateData = {
            content: newContent,
            updatedAt: timestamp
        };

        // 해당 문서 업데이트
        await updateDoc(memoRef, updateData);
        console.log(`메모(${memoId})가 성공적으로 수정되었습니다.`);
        return memoId;
    } catch (error) {
        console.error('메모 수정 중 오류:', error);
        throw error;
    }
}

// memo 삭제
exports.deleteMemo = async (memoId) => {
    try {
        const memoRef = doc(db, 'memos', memoId);
        await deleteDoc(memoRef);
        console.log(`메모(${memoId})가 성공적으로 삭제되었습니다.`);
        return memoId;
    } catch (error) {
        console.error('메모 삭제 중 오류:', error);
        throw error;
    }
}

// 북마크 추가
exports.bookmarkMemo = async (memoId) => {
    try {
        const memoRef = doc(db, 'memos', memoId);
        // 업데이트할 데이터 객체 생성
        const updateData = {
            bookmark: true
        };

        // 해당 문서 업데이트
        await updateDoc(memoRef, updateData);
        console.log(`메모(${memoId})가 북마크가 성공적으로 추가되었습니다.`);
        return memoId;
    } catch (error) {
        console.error('메모 수정 중 오류:', error);
        throw error;
    }
}

// 북마크 삭제
exports.unBookmarkMemo = async (memoId) => {
    try {
        const memoRef = doc(db, 'memos', memoId);
        // 업데이트할 데이터 객체 생성
        const updateData = {
            bookmark: false
        };

        // 해당 문서 업데이트
        await updateDoc(memoRef, updateData);
        console.log(`메모(${memoId}) 북마크가 성공적으로 삭제되었습니다.`);
        return memoId;
    } catch (error) {
        console.error('메모 수정 중 오류:', error);
        throw error;
    }
}

// 북마크한 글만 모아보기
exports.findByUserIdAndBookmark = async (userId) => {
    try {
        // 'memos' 컬렉션에서 특정 userID를 가진 게시글만 가져옴
        const querySnapshot = await getDocs(
            query(
                collection(db, 'memos'),
                where('userId', '==', userId),
                where('bookmark', '==', true),
                orderBy('createdAt', 'desc')
            )
        );

        // 각 게시글과 관련된 파일 정보를 포함한 배열 반환
        const memos = await Promise.all(querySnapshot.docs.map(async (memo) => {
            const files = await getFilesByMemoId(memo.id);
            return {
                id: memo.id,
                ...memo.data(),
                files: files,
            };
        }));
        return memos;
    } catch (error) {
        console.log("findByUserId 실행 중 오류:", error);
        throw error;
    }
}

// 특정 userId를 가진 모든 메모 삭제
exports.deleteMemosByUserId = async (userId) => {
    try {
        // userId와 일치하는 메모들을 쿼리
        const querySnapshot = await getDocs(
            query(
                collection(db, 'memos'),
                where('userId', '==', userId)));

        // 쿼리 결과가 비어있으면 아무 작업도 하지 않음
        if (querySnapshot.empty) {
            return null;
        }

        // 삭제된 메모들의 memoId 배열
        const deletedMemoIds = [];

        // 모든 메모를 삭제
        const deletionPromises = querySnapshot.docs.map(async (memo) => {
            const memoId = memo.id;
            const memoRef = doc(db, 'memos', memoId);
            await deleteDoc(memoRef);
            deletedMemoIds.push(memoId);
        });

        // 모든 삭제 작업을 기다림
        await Promise.all(deletionPromises);

        return deletedMemoIds;
    } catch (error) {
        console.error('메모 삭제 중 오류:', error);
        throw error;
    }
}