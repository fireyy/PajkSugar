var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('build', function () {

    return gulp.src('./build/pajksugar.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});
