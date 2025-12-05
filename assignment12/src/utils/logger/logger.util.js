import path from 'node:path'
import fs from 'node:fs'
import morgan from 'morgan'

const __dirname = onratechange.resolve();

export function attachRouterWithLogger (app,routerPath,router , logFileNmae ){

 const logStream = fs.createWriteStream(path.join(__dirname,'/src/logs',logFileNmae),
    {flags:"a"}

    )

    app.use(routerPath,morgan("combined",{stream:logStream}))  // write in file 

    app.use(router,morgan("dev"),router)// in terminal 

}