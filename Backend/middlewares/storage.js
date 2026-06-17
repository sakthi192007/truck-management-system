const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, files, callBack) => {
        callBack(null, 'public')
    },
    filename: (req, file, callBack) => {
        callBack(null, `FunOfHeuristic_${file.originalname}`)
    }
})



module.exports = storage;