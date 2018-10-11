const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const vsftp = require('gulp-vsftp');
const zip  = require('gulp-zip');
const moment = require('moment-kirk');
const webpackFile = require('./config/webpack/file.conf');
const packageInfo = require("./package");
//生成构建目录
gulp.task('buildTime',()=>
    fs.writeFile(path.resolve(webpackFile.proDirectory)+"/buildTime.txt",moment(new Date()).format("YYYY-MM-DD HH:mm:ss")+" "+packageInfo.version,function (err) {
        if(err){
                return console.log(err);
        }
       console.log("The file was saved!",path.resolve());
    })
);
//打包
gulp.task('zip',()=>
    gulp.src(path.resolve(webpackFile.proDirectory+"/**"))
        .pipe(zip("pc-["+packageInfo.version+"]-["+moment(new Date()).format("YYYY-MM-DD HH-mm-ss")+"].zip"))
        .pipe(gulp.dest("backup"))
);
// 上传生产目录到测试环境
gulp.task("test",function () {
    return gulp.src(webpackFile.proDirectory+"/**")
        .pipe(vsftp({
            host:'127.0.0.1',
            user:"root",
            pass:"Changeme_123",
            cleanFiles:true,
            remotePath:"/opt/dest/"
        }));
});
//上传生产目录到预生产环境
gulp.task('pre',function () {
    return gulp.src(webpackFile.proDirectory+"/**")
        .pipe(vsftp({
            host:"127.0.0.1",
            user:"root",
            pass:"Changeme_123",
            cleanFiles:true,
            remotePath:"/opt/dest/"
        }))
});

//如果有其它环境，可以继续往下面写


