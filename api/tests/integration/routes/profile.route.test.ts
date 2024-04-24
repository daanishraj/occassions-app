import app from "@/app";
import request from "supertest";

describe("/profile", () => {
  const path = "/profile";

  describe("GET /", () => {
    it("should get the profile data when a request is made", async () => {
      const { body } = await request(app).get(path).expect(200);
      expect(body.fullName).toBe("James Py");
    });
  });

  describe("PUT /", () => {
    it("should edit the profile data with the payload correctly", async () => {
      const { body: getResponse } = await request(app).get(path).expect(200);
      expect(getResponse.fullName).toBe("James Py");
      const updatedBody = {
        ...getResponse,
        fullName: "Paramahansa",
      };
      const { body: putResponse } = await request(app).put(path).send(updatedBody).expect(200);
      expect(putResponse.fullName).toBe("Paramahansa");
    });
  });
});
