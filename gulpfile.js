const gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    browserSync = require('browser-sync').create()

function activeSync(done) {
    browserSync.init({
        proxy: 'localhost:8000',
    })
    done()
}

function reloadBrowser(done) {
    browserSync.reload()
    done()
}

function clean() {
    return del(['static/css', 'static/js', 'static/img'])
}

function sass() {
    return gulp
        .src('assets/sass/style.scss')
        .pipe(gp.plumber())
        .pipe(gp.sourcemaps.init())
        .pipe(gp.sass())
        .pipe(gp.autoprefixer())
        .pipe(gp.csso())
        .pipe(gp.rename('styles.min.css'))
        .pipe(gp.sourcemaps.write(''))
        .pipe(gulp.dest('static/css'))
}

function scripts() {
    return gulp
        .src('assets/js/**/*.js')
        .pipe(gp.plumber())
        .pipe(gp.sourcemaps.init())
        .pipe(gp.babel({ presets: ['@babel/preset-env'] }))
        .pipe(gp.concat('all.js'))
        .pipe(gp.uglify())
        .pipe(gp.rename('scripts.min.js'))
        .pipe(gp.sourcemaps.write(''))
        .pipe(gulp.dest('static/js'))
}

function copyFonts() {
    return gulp
        .src('assets/fonts/**')
        .pipe(gp.rename({ dirname: '' }))
        .pipe(gulp.dest('static/fonts'))
}

function copyImages() {
    return gulp
        .src('assets/img/**/*.{png,jpg,svg,webp}')
        .pipe(gp.rename({ dirname: '' }))
        .pipe(gulp.dest('static/img'))
}

function compressImages() {
    return gulp
        .src('static/img/**/*.{png,jpg,svg,webp}')
        .pipe(
            gp.imagemin([
                gp.imagemin.mozjpeg({ progressive: true }),
                imageminJpegRecompress({
                    loops: 5,
                    min: 65,
                    max: 70,
                    quality: 'medium',
                }),
                gp.imagemin.optipng({ optimizationLevel: 3 }),
                pngquant({ quality: [0.6, 0.7], speed: 5 }),
                gp.imagemin.svgo(),
            ])
        )
        .pipe(gulp.dest('static/img'))
}

function libsCss() {
    return gulp
        .src('assets/libs_css/**/*.css')
        .pipe(gp.plumber())
        .pipe(gp.sourcemaps.init())
        .pipe(gp.concat('all.css'))
        .pipe(gp.rename('libs.min.css'))
        .pipe(gp.sourcemaps.write(''))
        .pipe(gulp.dest('static/css'))
}

function libsJs() {
    return gulp
        .src('assets/libs_js/**/*.js')
        .pipe(gp.plumber())
        .pipe(gp.sourcemaps.init())
        .pipe(gp.concat('all.js'))
        .pipe(gp.rename('libs.min.js'))
        .pipe(gp.sourcemaps.write(''))
        .pipe(gulp.dest('static/js'))
}

function svg() {
    return (
        gulp
            .src('static/img/**/*.svg')
            .pipe(
                gp.svgmin({
                    js2svg: {
                        pretty: true,
                    },
                })
            )
            .pipe(
                gp.cheerio({
                    run: function ($) {
                        $('[fill]').removeAttr('fill')
                        $('[stroke]').removeAttr('stroke')
                        $('[style]').removeAttr('style')
                    },
                    parserOptions: { xmlMode: true },
                })
            )
            .pipe(gp.replace('&gt;', '>'))
            // build svg sprite
            .pipe(
                gp.svgSprite({
                    mode: {
                        symbol: {
                            sprite: 'sprite.svg',
                        },
                    },
                })
            )
            .pipe(gulp.dest('static/img'))
    )
}

function watchChanges() {
    gulp.watch('assets/sass/**/*', sass)
    gulp.watch('assets/js/**/*', scripts)
    gulp.watch(
        'assets/img/**/*.{png,jpg,svg,webp}',
        gulp.series(copyImages, compressImages)
    )
    gulp.watch('static/**', reloadBrowser)
    gulp.watch('templates/**/*.html', reloadBrowser)
}

const build = gulp.series(
    clean,
    gulp.parallel(sass, libsCss, scripts, libsJs, copyFonts, copyImages),
    gulp.parallel(compressImages, svg)
)
const watch = gulp.parallel(watchChanges, activeSync)

exports.build = build
exports.watch = watch
