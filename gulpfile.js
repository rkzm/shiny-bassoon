var gulp, nodemon, gulp_mocha;
gulp = require('gulp');
nodemon = require('gulp-nodemon');
gulp_mocha = require('gulp-mocha');

gulp.task('default', function(){
  nodemon({
      script: 'server.js',
      ext: 'js',
      ignore: ['./node_modules/**']
  })
  .on ('restart', function(){
     console.log("restarting");
  });
});

gulp.task('test', function (){
    gulp.src('test/*.js', {read: false})
        .pipe(gulp_mocha({reporter: 'nyan'}));
});