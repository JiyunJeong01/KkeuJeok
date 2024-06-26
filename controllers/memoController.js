const MemoModel = require('../models/Memo'); 

module.exports = {
    memosLoading: async (req, res, next) => {
        try {
            const memos = await MemoModel.findAll();
            res.locals.memos = memos
            res.render('index');
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    },
}
