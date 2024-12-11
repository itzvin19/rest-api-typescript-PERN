import { server } from "./server"
import colors from "colors"

server.listen(4000,()=>{
    console.log(colors.rainbow("Hola mundo desde el puerto 4000"))
})