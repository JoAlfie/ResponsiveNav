// assuming gulp is already installed globally
// npm init
// npm i gulp gulp-less gulp-autoprefixer gulp-cssnano gulp-rename --save-dev
// npm i @babel/core gulp-babel gulp-concat gulp-uglify --save-dev

const { src, dest, task, watch, parallel } = require("gulp");
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

// compile the styles.less file into styles.min.css

const compileLess = function(cb) {
	return src("**/styles.less")
		.pipe(less())
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(cssnano())
		.pipe(rename("styles.min.css"))
		.pipe(dest("./public/stylesheets"));
	cb();
};
compileLess.displayName = "less";

// command: gulp less
task(compileLess);

// watch styles.less and compile on save

task("doLess", function() {
	watch("**/**.less", function compileLess(cb) {
		return src("**/styles.less")
			.pipe(less())
			.pipe(
				autoprefixer({
					cascade: false,
				})
			)
			.pipe(cssnano())
			.pipe(rename("styles.min.css"))
			.pipe(dest("./public/stylesheets"));
		cb();
	});
});

task("vendorScripts", function() {
	watch("./development/scripts/vendor/**.js", function compileVendorScripts(
		cb
	) {
		return src(["./development/scripts/vendor/*.js"])
			.pipe(concat("vendor-scripts.js"))
			.pipe(dest("./public/scripts"))
			.pipe(rename("vendor-scripts.min.js"))
			.pipe(uglify())
			.pipe(dest("./public/scripts"));
		cb();
	});
});
task("appScripts", function() {
	watch("./development/scripts/main/*.js", function compileAppScripts(cb) {
		return src("./development/scripts/main/*.js")
			.pipe(babel({ presets: ["@babel/preset-env"] }))
			.pipe(
				rename(function(path) {
					path.extname = ".min.js";
				})
			)
			.pipe(uglify())
			.pipe(dest("./public/scripts"));
		cb();
	});
});

task("doScripts", parallel("appScripts", "vendorScripts"));

/* task("images", function() {
	watch(".development/images/*.*", function optimiseImages(cb) {
		return src("./development/images/*.*")
			.pipe(imagemin())
			.pipe(dest("./public/images"));
		cb();
	});
}); */

task("images", function optimiseImages(cb) {
	return src("./development/images/*.*")
		.pipe(imagemin())
		.pipe(dest("./public/images"));
	cb();
});

task("dev", parallel("doLess", "appScripts", "vendorScripts"));
