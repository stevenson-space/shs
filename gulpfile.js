var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var wait = require('gulp-wait');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

//Minify scripts
gulp.task('scripts', function() 
{
    return gulp.src('./dev/js/**/*.js')
        .pipe(plumber(plumber(
        {
            errorHandler: function (err) 
            {
                console.log(err);
                this.emit('end');
            }
        })))
        .pipe(uglify(
        {
            output: 
            {
                comments: '/^!/'
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./docs/js'));
});

//Compile SASS, autoprefix and minify
gulp.task('styles', function () 
{
    return gulp.src('./dev/styles/style.sass')
        .pipe(wait(250))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(gulp.dest('./docs/styles'));
});

gulp.task('watch', ['scripts', 'styles'], function() 
{
    gulp.watch('dev/js/*.js', ['scripts']);
    gulp.watch('dev/styles/*.sass', ['styles']);
});
