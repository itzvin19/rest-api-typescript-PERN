import request from "supertest"
import { server, connectDb } from "../server"
import { db } from "../config/db"


jest.mock("../config/db")

describe('DB Authentication', () => {
    it('should display a error of bad bd authentication',async () => {

        jest.spyOn(db, "authenticate").mockRejectedValueOnce(new Error("Ocurrió un error en la conexión"))
        const consoleSpy=jest.spyOn(console,"log")

        await connectDb()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Ocurrió un error en la conexión")
        )
        
    })
})