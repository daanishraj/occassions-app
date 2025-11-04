import app from "@/app";
import request from "supertest";

describe("/occasions", () => {
  const path = "/occasions";
  const testUserId = "test-user-id-123";

  describe("GET /", () => {
    it("should get all the occasions when a request is made", async () => {
      const { body } = await request(app)
        .get(path)
        .set("Authorization", `Bearer ${testUserId}`)
        .expect(200);
      expect(Array.isArray(body)).toBe(true);
    });
  });
});
