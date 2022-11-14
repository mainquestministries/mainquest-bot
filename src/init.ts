import type { PromptObject } from "prompts"
import {execa} from "execa"
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "fs"
import prompts from "prompts"
import path, { join } from "path"
import { Spinner } from "@favware/colorette-spinner";

const __dirname = path.resolve(path.dirname(''))
function write_file(filename: string, data: any) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    writeFileSync(join(__dirname, filename), data, {
      flag: 'w',
    });
  }

function copy(src:string, dest:string) {
    copyFileSync(join(__dirname, src), join(__dirname, dest))
}
const Prompt : PromptObject<PromptTypes>[] = [
    {
    type : "select",
    name: "database_type",
    message: "Which database do you want?",
    choices: [
        {
            title: "SQLite (Recommended for testing)", value: "sqlite"
        },
        {
            title: "PostgreSQL (Recommended for production environments", value: "postgres"
        }
    ]
},
{
    type: prev => prev == "postgres" ? "text" : null,
    name: "database_string",
    message: "Enter your Database string here.",
    initial: "USERNAME:PASSWORD@hostname:port/DATABASE"
},
{
    type: "text",
    name: "discord_token",
    initial: "(Reuse)",
    message: "Enter your Token for discord. See https://www.writebots.com/discord-bot-token/ for help. The Bot must have also the scope \"applications\". Leave empty for reuse.",
},]

type PromptTypes = "database_type" | "database_string" | "discord_token"

async function main() {const response = await prompts<PromptTypes>(Prompt)


const discord_token=`DISCORD_TOKEN=\"${response.discord_token}\"`
const database_type=response.database_type
const database_string= `DATABASE_URL=\"postgresql://${response.database_string}\"`

if(response.discord_token !== "(Reuse)")
write_file("./src/.env", discord_token)

const npx_args =["prisma", "migrate", "deploy"]
let write_to_db = true
if (database_type==="postgres") {
    
    write_file("./.env", database_string)
    rmSync(join(__dirname, "./prisma"), {
        force: true,
        recursive: true
    })
    mkdirSync(join(__dirname, "./prisma"))
    copy("./postgres.prisma", "./prisma/schema.prisma")
    write_to_db=false
}
else {
//copy("./sqlite.prisma", "./prisma/schema.prisma")
rmSync(join(__dirname, "prisma/migrations", 
), {
    force: true,
    recursive: true
})}

const spin = new Spinner()
if (write_to_db){
spin.start({text: "Writing to Database. Please wait.🐈"})
try {
await execa("npx", npx_args)
await execa("npx", ["prisma", "generate"])
} catch (e){
    spin.error({
        text: "Failed to write to the Database.",
        mark: "😿"
    })
    console.error(e)
    process.exit(1)
};
spin.stop({
    text: "Succeded",
    mark: "😸"
})}
else {
    //console.log("Please remove everything in the prisma/ folder. ")
    //console.log("Copy postgres.prisma into the folder.")
    console.log("Run npx \nprisma migrate dev --name init \nmanually")
}}
main()
