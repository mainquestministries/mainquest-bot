const { rmSync } = require("fs");
const {join} = require("path");
const path = require("path")
const _dirname_ = path.resolve(path.dirname(''))

rmSync(join(_dirname_, "./node_modules"), {
    force: true,
    recursive: true
})
rmSync(join(_dirname_, "./package-lock.json"))
rmSync(join(_dirname_, "./dist"), {
    force: true,
    recursive: true
})