const { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where } = require('firebase/firestore');
const { db } = require('../fbase');

// 유저 찾기
exports.getUserByEmail = async (email) => {
    try {
        // 'users' 컬렉션에서 특정 emila을 가진 유저만 가져옴
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
        
        // 문서가 존재하지 않는 경우 null 반환
        if (querySnapshot.empty) {
            return null;
        }

        const user = querySnapshot.docs[0].data();
        const userData = {
            id: querySnapshot.docs[0].id,
            ...user
        };
        return userData;
    } catch (error) {
        console.log("getUserByEmail 실행 중 오류:", error);
        throw error;
    }
}

// 유저 등록
exports.creatdUser = async (email, name, password) => {
    try {
        const timestamp = new Date(); // 현재 타임스탬프

        // 새로운 유저 객체 생성
        const userData = {
            email,
            name,
            password,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        // 'users' 컬렉션에 새로운 유저 문서 추가
        const docRef = await addDoc(collection(db, 'users'), userData);

        console.log("유저가 추가되었습니다. ID:", docRef.id);

        return docRef.id; // 새로 추가된 유저의 ID 반환
    } catch (error) {
        console.error("유저 추가 중 오류:", error);
        throw error;
    }
}