import app from "@/app";
import request from "supertest";

describe("/occasions", () => {
  const path = "/occasions";
  const testUserId = "test-user-id-123";

  describe("GET /", () => {
    it("should get all the occasions when a request is made", async () => {
      const response = await request(app)
        .get(path)
        .set("Authorization", `Bearer ${testUserId}`);
      
      if (response.status !== 200) {
        console.error('Response status:', response.status);
        console.error('Response body:', response.body);
      }
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2); // Should have seeded test data
      
      // Verify the structure of returned occasions
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('userId', testUserId);
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('occasionType');
        expect(response.body[0]).toHaveProperty('month');
        expect(response.body[0]).toHaveProperty('day');
      }
    });
  });
});
