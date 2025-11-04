import app from "@/app";
import request from "supertest";

describe("/profile", () => {
  const path = "/profile";

  describe("GET /", () => {
    it("should get the profile data when a request is made", async () => {
      const { body } = await request(app).get(path).expect(200);
      expect(body.firstName).toBe("James");
      expect(body.lastName).toBe("Py");
    });
  });

  describe("PUT /", () => {
    it("should edit the profile data with the payload correctly", async () => {
      const { body: getResponse } = await request(app).get(path).expect(200);
      expect(getResponse.firstName).toBe("James");
      expect(getResponse.lastName).toBe("Py");
      const updatedBody = {
        ...getResponse,
        firstName: "Paramahansa",
      };
      const { body: putResponse } = await request(app).put(path).send(updatedBody).expect(200);
      expect(putResponse.firstName).toBe("Paramahansa");
      expect(putResponse.lastName).toBe("Py");
    });
  });
});
