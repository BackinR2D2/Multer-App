const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const multer = require('multer')
const path = require('path')
let srcs = []
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        verifyType(file, cb);
    }
}).single('img')

function verifyType(file, cb) {
    const types = /jpeg|jpg|png|gif/;
    const ext = types.test(path.extname(file.originalname).toLowerCase())
    const mimeType = types.test(file.mimetype)
    if (ext && mimeType) {
        return cb(null, true)
    } else {
        cb('Images only.')
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('home', { msg: err })
        } else {
            if (req.file == undefined) {
                res.render('home', { msg: 'No file selected.' })
            } else {
                srcs.push(`uploads/${req.file.filename}`)
                res.render('posts', {
                    srcs: srcs
                })
            }
        }
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})