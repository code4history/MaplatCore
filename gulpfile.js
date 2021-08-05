/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-empty */
const gulp = require("gulp");
const fs = require("fs-extra");
const zip = require("gulp-zip");
const spawn = require("child_process").spawn;
const psaux = require("psaux");
const terminate = require("terminate");

gulp.task("e2e:start", () => {
  console.log("Hoge");
  spawn("npm", ["run", "server:e2e"], {
    stdio: "ignore",
    detached: true
  }).unref();
  return Promise.resolve();
});

gulp.task("e2e:stop", () =>
  psaux().then(list => {
    list.filter(ps =>
      ps.command ? ps.command.match(/webpack-dev-server/) : false
    ).map(ps => {
      terminate(ps.pid, err => {
        if (err) {
          console.log(`Terminate server fail:${err}`);
        }
        else {
          console.log("Terminate server done");
        }
      });
    });
  })
);

gulp.task("zip", async () => {
  try {
    fs.removeSync("./distribution.zip");
  } catch (e) { }
  try {
    fs.removeSync("./distribution");
  } catch (e) { }
  try {
    fs.removeSync("./example.zip");
  } catch (e) { }
  try {
    fs.removeSync("./example");
  } catch (e) { }

  fs.copySync("./dist/assets", "./distribution");

  await new Promise((resolve, reject) => {
    gulp
      .src(["./distribution/**/*"])
      .pipe(zip("distribution.zip"))
      .on("error", reject)
      .pipe(gulp.dest("./"))
      .on("end", resolve);
  });
  fs.removeSync("./distribution");

  fs.copySync("./dist", "./example");
  fs.copySync("./apps", "./example/apps");
  fs.copySync("./maps", "./example/maps");
  fs.copySync("./pois", "./example/pois");
  fs.copySync("./tiles", "./example/tiles");
  fs.copySync("./parts_test", "./example/parts_test");

  await new Promise((resolve, reject) => {
    gulp
      .src(["./example/**/*"])
      .pipe(zip("example.zip"))
      .on("error", reject)
      .pipe(gulp.dest("./"))
      .on("end", resolve);
  });

  fs.removeSync("./example");
});

gulp.task("git_switch", async () => {
  try {
    fs.statSync('.git.open');
    fs.moveSync('.git', '.git.keep');
    fs.moveSync('.git.open', '.git');
  } catch(e) {
    fs.moveSync('.git', '.git.open');
    fs.moveSync('.git.keep', '.git');
  }
});