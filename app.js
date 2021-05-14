const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
    //where we want our file to be uploaded
    destination: './public/uploads/',
    filename: function(req,file,cb){      
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//Init Upload 
const upload  = multer({
    storage: storage,
    limits: {fileSize: 1000000},//putting size limit
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage');

//Check file type
function checkFileType(file,cb){
    //Allowed extenxions
    const filetypes = /jpeg|jpg|png|gif/;
    //check extension
    //@para file extension on which test is performed
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check mime 
    //@para file mimetype(one of the JSON property)
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error:Images Only');
    }
} 
const app = express();

app.set('view engine','ejs');
app.use(express.static('./public'));

app.get('/',(req,res)=>{
    res.render('index');
});
app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{msg: err});
        }else{
            // console.log(req.file);//file information
            // res.send('OK');
            if(req.file == undefined){
             res.render('index',{
                 msg: 'Error: No File Selected!'
             });   
            }else{
                res.render('index',{
                    msg: 'File Uploaded',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    });
});

const port=3000;

app.listen(port,()=> console.log("server is up and running"));

//req.file
// {
//     fieldname: 'myImage',
//     originalname: 'labreportnew (1) (2).pdf',
//     encoding: '7bit',
//     mimetype: 'application/pdf', or 'image/jpeg'
//     destination: './public/uploads/',
//     filename: 'myImage-1620890770427.pdf',
//     path: 'public\\uploads\\myImage-1620890770427.pdf',
//     size: 536761
//   }
