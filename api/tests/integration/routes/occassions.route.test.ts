import app from "@/app";
// import app from "../../../src/app";
import request from "supertest";


const baseUrl = "localhost:5000"

describe("/occassions", () => {
    const path = "/occassions"

    describe("GET /", ()=>{
        it("should get all the occassions when a request is made", async () => {
            const url = `${baseUrl}/${path}`;
            const { body } =  await request(app).get(url)


            console.log(body)
        })
    })
})