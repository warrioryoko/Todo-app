var gulp = require('gulp');
var watch = require('gulp-watch');
var jst = require('gulp-jst');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var uglify = require("gulp-uglify");
var notify = require("gulp-notify");
var exec = require("gulp-exec");
var _ = require("underscore");
var beautify = require('gulp-beautify');
var docco = require("gulp-docco");
var beautify = require('gulp-beautify');

gulp.task('beautify', function() {

    gulp.src('./js/cal/*.js')
    
    .pipe( beautify( {indentSize: 4} ) )
    
    .pipe(gulp.dest('./js/cal'))
});

gulp.task('sass', function() {

    return gulp.src('css/cal/css.scss')

        .pipe( sass( {outputStyle: 'compressed'} ) )
        
        //notify the user if an error occurs
        .on('error', notify.onError())

        .pipe( gulp.dest('build/') );
});

gulp.task('compile_templates', function(){

    var templateSettings = {
            variable    : 'd',
            interpolate : /\{\{(.+?)\}\}/g,
            escape      : /\{\{\{(.+?)\}\}\}/g,
            evaluate    : /<%([\s\S]+?)%>/g
    };
    
    var exportString = "module.exports = this['templates'];" ;

    gulp.src( ['templates/cal/*.html'] )
    
    .pipe( jst(templateSettings) )
    
    //notify the user if an error occurs
    .on('error', notify.onError())
    
    .pipe(declare({
        namespace: 'templates'
    }))
    
    //notify the user if an error occurs
    .on('error', notify.onError())
    
    .pipe( concat('templates.js', {newLine: ';\n\n'}) )
    
    .pipe( gulp.dest('js/cal/') )
    
    .pipe( exec('echo "\n\n'+exportString+'" >> js/cal/templates.js') );

});


gulp.task('compile_samegrain', function() {

    //the .js file that browserify is going to compile
    gulp.src( ['js/cal/cal.js'] )
    
    .pipe( browserify(  ) )
    
    //notify the user if an error occurs
    .on('error', notify.onError())

    .pipe( concat('cal.js') )

    .pipe( gulp.dest('./build') );

});


gulp.task('watch_compile', function() {

    gulp.watch("templates/cal/*.html", ['compile_templates']);
    gulp.watch("js/cal/*.js", ['compile_samegrain']);
    gulp.watch("css/cal/*.*css", ['sass']);

});

gulp.task('default', ['watch_compile']);

