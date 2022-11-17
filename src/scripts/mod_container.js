import { copyFileSync, rmSync } from "fs"
import { join } from "path"

function main(){
if ((process.env.DB_TYPE)===undefined) {
    console.log("No known DB_TYPE")
    process.exit(1)}
copyFileSync(join(`/opt/app/${process.env.DB_TYPE}.prisma`), "/opt/app/prisma/schema.prisma")
}
main()