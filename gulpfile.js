const projectFolder = 'new_gulp_project';
const srcFolder = '#src';
const distFolder = 'dist';

let path = {
  src: {
    html: `${srcFolder}/*.{html,pug,hbs,handlebars}`,
    css: `${srcFolder}/scss/index.scss`,
    js: `${srcFolder}/js/index.js`,
    img: `${srcFolder}/img/**/*.{jpg,png,gif,ico,webp}`,
    svg: `${srcFolder}/svg/**/*.svg`,
    fonts: `${srcFolder}/fonts/icomoon/*.*`
  },
  watch: {
    html: `${srcFolder}/**/*.{html,pug,hbs,handlebars}`,
    css: `${srcFolder}/scss/**/*.scss`,
    js: `${srcFolder}/js/**/*.js`,
    img: `${srcFolder}/img/**/*.{jpg,png,gif,ico,webp}`,
    svg: `${srcFolder}/svg/**/*.svg`,
    fonts: `${srcFolder}/fonts/icomoon/*.*`
  },
  dist: {
    html: `${distFolder}/`,
    css: `${distFolder}/css/`,
    js: `${distFolder}/js/`,
    img: `${distFolder}/img/`,
    svg: `${distFolder}/svg/`,
    fonts: `${srcFolder}/fonts/icomoon/`
  },
  clean: `./${distFolder}/`
};

const { 
  src, 
  dest, 
  watch, 
  series, 
  parallel 
} = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const fileInclude = require('gulp-file-include');
const groupMedia = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const scss = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const htmlBeautify = require('gulp-html-beautify');
const notify = require('gulp-notify');

const browserSyncTask = () => {
  browserSync.init({
    server: {
      baseDir: distFolder
    },
    port: 3000,
    notify: false,
    online: true
  })
};

const htmlBeautifyConfig = {
  indentSize: 2
};

const htmlTask = () => {
  return src(path.src.html)
    .pipe(fileInclude())
    .pipe(htmlBeautify(htmlBeautifyConfig))
    .pipe(dest(path.dist.html))
    .pipe(browserSync.stream())
    .pipe(notify(`${projectFolder} started!`))
};

const cssTask = () => {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
    )
    .pipe(
      groupMedia()
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true
      })
    )
    .pipe(dest(path.dist.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(dest(path.dist.css))
    .pipe(browserSync.stream())
};

const jsTask = () => {
  return src(path.src.js)
    .pipe(fileInclude())
    .pipe(dest(path.dist.js))
    .pipe(
      uglify()
    )
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(dest(path.dist.js))
    .pipe(browserSync.stream())
};

const imgTask = () => {
  return src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3
      })
    )
    .pipe(dest(path.dist.img))
    .pipe(browserSync.stream())
};

const svgTask = () => {
  return src(path.src.svg)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3
      })
    )
    .pipe(dest(path.dist.svg))
    .pipe(browserSync.stream())
};

const fontsTask = () => {
  return src(path.src.fonts)
    .pipe(
      dest(path.dist.fonts)
    )
    .pipe(browserSync.stream())
};

const watchFilesTask = () => {
  watch([path.watch.html], htmlTask);
  watch([path.watch.css], cssTask);
  watch([path.watch.js], jsTask);
  watch([path.watch.img], imgTask);
  watch([path.watch.svg], svgTask);
  watch([path.watch.fonts], fontsTask);
};

const cleanTask = () => del(path.clean);

const seriesTask = series(cleanTask, parallel(
  htmlTask,
  cssTask,
  jsTask,
  imgTask,
  svgTask,
  fontsTask,
))

const parallelTask = parallel(
  seriesTask,
  watchFilesTask,
  browserSyncTask
);

exports.htmlTask = htmlTask;
exports.cssTask = cssTask;
exports.jsTask = jsTask;
exports.imgTask = imgTask;
exports.svgTask = svgTask;
exports.fontsTask = fontsTask;
exports.seriesTask = seriesTask;
exports.parallelTask = parallelTask;
exports.default = parallelTask;