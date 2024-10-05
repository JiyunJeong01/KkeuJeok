const MemoModel = require('../models/Memo');
const FileModel = require('../models/File');

module.exports = {
    memosLoading: async (req, res) => {
        const memos = await MemoModel.findAll();
        res.locals.memos = memos;
        res.render('index');
    },

    memosLoadingUser: async (req, res) => {
        if (req.session.user) {
            const userId = req.session.user.id;
            const memos = await MemoModel.findByUserId(userId);
            res.locals.memos = memos;
            res.render('index');
        } else {
            res.redirect('/home');
        }
    },

    createMemo: async (req, res) => {
        const userId = req.session.user ? req.session.user.id : 0;
        const content = req.body.content;

        let memoId = await MemoModel.createMemo(userId, content);

        if (req.files && req.files.length > 0) {
            await FileModel.uploadFile(userId, memoId, req.files);
        }

        res.send('<script>alert("메모가 생성되었습니다."); window.location.replace("/");</script>');
    },

    modifiedMemo: async (req, res) => {
        const userId = req.session.user ? req.session.user.id : 0;
        let memoId = req.params.memoId;
        const content = req.body.content;
        await MemoModel.modifiedMemo(memoId, content);

        if (req.files && req.files.length > 0) { 
            await FileModel.uploadFile(userId, memoId, req.files);
        }

        res.status(200).json({ message: "메모가 성공적으로 수정되었습니다." });
    },

    deleteMemo: async (req, res) => {
        const userId = req.session.user ? req.session.user.id : 0;
        let memoId = req.params.memoId;
        await MemoModel.deleteMemo(memoId);
        await FileModel.deleteFiles(userId, memoId)
        res.status(200).json({ message: "메모가 성공적으로 삭제되었습니다." });
    },

    deleteImage: async (req, res) => {
        const userId = req.session.user ? req.session.user.id : 0;
        let memoId = req.params.id;
        let index = req.params.index;
        await FileModel.deleteOneFile(memoId, index, userId);
        res.send(200);
    },

    searchMemo: async (req, res) => {
        if (req.session.user) {
            const userId = req.session.user.id;
            const query = req.query.q;
            const memos = await MemoModel.searchMemo(userId, query);
            res.locals.memos = memos
            res.render('search');
        } else {
            res.redirect('/home')
        }
    },

    bookmarkMemo: async (req, res) => {
        let memoId = req.params.memoId;
        await MemoModel.bookmarkMemo(memoId);
        res.status(200).json({ message: "북마크 되었습니다." });
    },

    unBookmarkMemo: async (req, res) => {
        let memoId = req.params.memoId;
        await MemoModel.unBookmarkMemo(memoId);
        res.status(200).json({ message: "언북마크 되었습니다." });
    },

    bookmarksLoadingUser: async (req, res) => {
        if (req.session.user) {
            const userId = req.session.user.id;
            const memos = await MemoModel.findByUserIdAndBookmark(userId);
            res.locals.memos = memos
            res.render('bookmark');
        } else {
            res.redirect('/home')
        }
    },
}
