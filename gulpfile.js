var gulp = require('gulp');
var bump = require('gulp-bump');
 
// Basic usage:
// Will patch the version
gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));

 
});

gulp.task('bump-config', function(){
  
    gulp.src('./src/config.js')
    .pipe(bump())
    .pipe(gulp.dest('./src'));
  });