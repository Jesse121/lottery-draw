var gulp = require('gulp'); //本地安装gulp所用到的地方
var sass = require('gulp-ruby-sass'); //编译SASS
var sourcemaps = require('gulp-sourcemaps'); //使得浏览器能够直接调试SCSS
var notify = require('gulp-notify'); //更动通知
var webserver = require('gulp-webserver'); //开启静态服务器

var htmlmin = require('gulp-htmlmin'); //html文件压缩
var cssmin = require('gulp-clean-css'); //css文件压缩
var jsmin = require('gulp-uglify'); //JS文件压缩 
var imgmin = require('gulp-imagemin'); //图片压缩
var rename = require('gulp-rename'); //重命名
var copy = require('gulp-copy'); //文件复制
var changed = require('gulp-changed'); // 只处理有变化的文件 
var replace = require('gulp-replace'); // 替换压缩后的js和css文件名称

//**********************************//
//以下是开发过程中的需要执行各种任务//
//**********************************//


//开启静态服务器
gulp.task('webserver', function() {
  gulp.src('./src/')
    .pipe(webserver({
      //域名 推荐写内网IP方便手机端同步调试，默认localhost
      host: '14.15.8.66',
      //端口 随机生成端口，方便多项目调试
      port: 3000 + Math.ceil(Math.random() * 9),
      //自动开启浏览器
      open: true,
      //实时刷新代码。
      livereload: true
    }))
});

//html文件有变化时，自动更新
gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(notify({
      message: 'HTML has been modified!'
    }));
});

//css文件有变化时，自动更新
gulp.task('css', function() {
  gulp.src('./src/css/*.css')
    .pipe(notify({
      message: 'CSS has been modified!'
    }));
});

//将SCSS文件编译为css文件  
gulp.task('sass', function() {
  sass('./src/css/scss/*.scss', {
      //为scss编译的css添加sourcemap，使得在浏览器中能显示scss文件的具体行数
      sourcemap: true,
      //Sass to CSS 的输出样式：nested,compact,expanded,compressed。
      style: 'expanded',
      //取消scss缓存
      // noCache: true,
      //scss缓存文件的位置
      cacheLocation: './src/css/scss/'
    })
    .pipe(sourcemaps.write())
    .on('error', sass.logError)
    .pipe(gulp.dest('./src/css/'))
    .pipe(notify({
      message: 'SCSS has been modified!'
    }));
});


//js文件有变化时，自动更新
gulp.task('js', function() {
  gulp.src('./src/js/*.js')
    .pipe(notify({
      message: 'JavaScript has been modified!'
    }));
});


//**********************************//
//以下是开发调试过程中的各种监听任务//
//**********************************//

// 监听文件变化,在命令行项目目录下使用 gulp watch启动此任务,监听的文件有变化就自动执行
gulp.task('watch', function() {
  //监听HTML
  gulp.watch('./src/*.html', ['html']);
  //监听css
  gulp.watch('./src/css/*.css', ['css']);
  //监听scss
  gulp.watch('./src/css/scss/*.scss', ['sass']);
  //监听js
  gulp.watch('./src/js/*.js', ['js']);
});

//项目开始编码时，执行gulp命令打开服务器并监听各文件变化，浏览器实时刷新
gulp.task('default', ['webserver', 'watch']);



//******************************************//
//以下是开发结束后打包到生产环境中的各种任务//
//******************************************//


//html文件压缩,在命令行项目目录下使用 gulp htmlmin 启动此任务
gulp.task('htmlmin', function() {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  gulp.src('./src/*.html')
    .pipe(changed('./dist/'))
    .pipe(replace('kinerLottery.css', 'kinerLottery.min.css'))
    .pipe(replace('kinerLottery.js', 'kinerLottery.min.js'))
    .pipe(htmlmin(options))
    .pipe(gulp.dest('./dist/'))
    .pipe(notify({
      message: 'HTML has been packaged!'
    }));
});

//css文件压缩,在命令行项目目录下使用 gulp cssmin 启动此任务
gulp.task('cssmin', function() {
  gulp.src('./src/css/*.css')
    .pipe(changed('./dist/'))
    .pipe(cssmin({
      //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
      advanced: false,
      //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
      compatibility: 'ie8',
      //类型：Boolean 默认：false [是否保留换行]
      keepBreaks: false
    }))
    .pipe(rename({
      //对压缩后的文件添加min后缀
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(notify({
      message: 'CSS has been packaged!'
    }));
});

// js文件压缩 ,在命令行项目目录下使用 gulp jsmin 启动此任务
gulp.task('jsmin', function() {
  gulp.src('./src/js/*.js')
    .pipe(changed('./dist/'))
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(notify({
      message: 'Javascript has been packaged!'
    }));
});

//图片压缩,在命令行项目目录下使用 gulp imgmin 启动此任务
gulp.task('imgmin', function() {
  gulp.src('./src/img/**/*.{png,jpeg,gif,ico,svg}')
    .pipe(changed('./dist/'))
    .pipe(imgmin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      svgoPlugins: [{ removeViewBox: true }]
    }))
    .pipe(gulp.dest('./dist/img/'));
});

//文件复制
gulp.task('copy', function() {
  gulp.src(['./src/fonts/*','./src/libs/**/*'])
    .pipe(copy('./dist/', { prefix: 1 }));
})




// 开发完成执行打包任务,在命令行项目目录下使用 gulp build启动此任务
gulp.task('build', ['cssmin', 'jsmin', 'imgmin', 'copy', 'htmlmin']);