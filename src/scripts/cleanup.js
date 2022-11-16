import { rmSync } from "fs";
import path, {join} from "path"

const __dirname = path.resolve(path.dirname(''))

rmSync(join(__dirname, "./node_modules"), {
    force: true,
    recursive: true
})
rmSync(join(__dirname, "./package-lock.json"))
rmSync(join(__dirname, "./dist"), {
    force: true,
    recursive: true
})