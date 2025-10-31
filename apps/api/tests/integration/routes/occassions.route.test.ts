import app from "@/app";
import request from "supertest";

describe("/occassions", () => {
  const path = "/occassions";

  describe("GET /", () => {
    it("should get all the occassions when a request is made", async () => {
      const { body } = await request(app).get(path).expect(200);
      console.log(body);
    });
  });
});
