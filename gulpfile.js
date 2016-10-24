'use strict';

var path = require('path');
var gulp = require('gulp');  // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
var livereload = require('gulp-livereload'); // Livereload support for the browser
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var chalk = require('chalk'); // Allows for coloring for logging
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process
var bump = require('gulp-bump');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

// Configuration for Gulp
var config = {
  js: {
    src: './src/main.js',
    watch: './src/**/*',
    outputDir: './public/assets/js/',
    outputFile: 'bundle.js',
  },
};

// Error reporting function
function mapError(err) {
  if (err.fileName) {
    // Regular error
    gutil.log(chalk.red(err.name)
      + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
      + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
      + ': ' + chalk.blue(err.description));
  } else {
    // Browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message));
  }
}

// Completes the final file outputs
function bundle(bundler) {
  var bundleTimer = duration('Javascript bundle time');
  bundler
    .bundle()
    .on('error', mapError) // Map error reporting
    .pipe(source('main.js')) // Set source name
    .pipe(buffer()) // Convert to gulp pipeline
    .pipe(rename(config.js.outputFile)) // Rename the output file
    //.pipe(uglify())
    .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
    .pipe(sourcemaps.write('./')) // Set folder for sourcemaps to output to
    .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
    .pipe(notify({
      "title": "Gulp Information",
      "sound": true, // case sensitive
      "icon": path.join(__dirname, "gulpbuild.png"), // case sensitive
      "message": "Generated file: <%= file.relative %> at <%= options.date %>",
      "onLast": true,
      "templateOptions": {
          date: new Date()
       }
    })) // Output the file being created
    .pipe(bundleTimer) // Output time timing of the file creation
    .pipe(livereload()); // Reload the view in the browser
}

// Gulp task for build
gulp.task('build', function() {
  livereload.listen(); // Start livereload server

  var args = merge(watchify.args, { debug: true }); // Merge in default watchify args with browserify arguments

  var bundler = browserify(config.js.src, args) // Browserify
    .plugin(watchify, {ignoreWatch: ['**/package.json', '**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
    .transform(babelify, {presets: ['es2015', 'react'], plugins: ['transform-es2015-for-of']}); // Babel tranforms

  var pkg = gulp.watch('./public/assets/js/bundle.js');
  bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

  bundler.on('update', function() {
    bundle(bundler); // Re-run bundle on source updates
  });
  pkg.on('change', function(){
      gulp.src('./package.json')
          .pipe(bump({type:'prerelease'}))
          .pipe(gulp.dest('./'));
  });
});
gulp.task('buildprod', function() {
    var args = merge(watchify.args, { debug: true });
    browserify(config.js.src) // Browserify
      .transform(babelify, {presets: ['es2015', 'react']})
      .bundle()
      .pipe(source('main.js')) // Set source name
      .pipe(buffer()) // Convert to gulp pipeline
      .pipe(rename(config.js.outputFile)) // Rename the output file
      .pipe(uglify())
      .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
      .pipe(sourcemaps.write('./')) // Set folder for sourcemaps to output to
      .pipe(gulp.dest(config.js.outputDir));
});
gulp.task('minor', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});
gulp.task('major', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'major'}))
        .pipe(gulp.dest('./'));
});
gulp.task('patch', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});
gulp.task('minifyJS', function () {
    gulp.src('./public/assets/js/bundle.js')
        .pipe(rename('bundle.min.js'))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('minifyCSS', function () {
    gulp.src('./public/assets/css/custom.css')
        .pipe(rename('custom.min.css'))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/assets/css/'));
});

gulp.task('default', ['build']);
