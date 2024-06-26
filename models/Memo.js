const { collection, getDocs } = require('firebase/firestore');
const { db } = require('../fbase');

// 전체 게시글 조회
exports.findAll = async () => {
    try {
        // 'memos' 컬렉션의 모든 문서를 가져옴
        const querySnapshot = await getDocs(collection(db, 'memos'));
        const memos = [];
        querySnapshot.forEach((doc) => {
            // 각 문서 데이터를 객체로 변환하여 배열에 추가
            memos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return memos;
    } catch (error) {
        console.log("findAll 실행 중 오류:", error);
        throw error; // 오류를 호출자에게 전달
    }
}