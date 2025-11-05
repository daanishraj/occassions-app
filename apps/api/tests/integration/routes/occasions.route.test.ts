import { vi } from "vitest";

// Mock the authentication middleware BEFORE importing app
// This ensures the routes use the mocked version
vi.mock("@/middleware/auth", async () => {
  const actual = await vi.importActual("@/middleware/auth");
  const { mockRequireAuth } = await import("../../helpers/auth");
  return {
    ...actual,
    requireAuth: mockRequireAuth,
  };
});

import app from "@/app";
import { Month, OccasionType } from "@prisma/client";
import request from "supertest";
import { getAuthHeader } from "../../helpers/auth";
import { TEST_USER_ID } from "../../helpers/constants";

describe("/occasions", () => {
  const path = "/occasions";
  const testUserId = TEST_USER_ID;

  describe("GET /", () => {
    it("should get all the occasions when a request is made", async () => {
      const response = await request(app)
        .get(path)
        .set("Authorization", getAuthHeader(testUserId));
      
      if (response.status !== 200) {
        console.error('Response status:', response.status);
        console.error('Response body:', response.body);
      }
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2); 
      
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

  describe("PUT /:id", () => {
    let occasionId: string;

    beforeEach(async () => {
      // Create an occasion to edit (userId is now handled by auth middleware)
      const newOccasion = {
        name: "Occasion to Edit",
        occasionType: OccasionType.Anniversary,
        month: Month.April,
        day: 5,
      };

      const createResponse = await request(app)
        .post(path)
        .set("Authorization", getAuthHeader(testUserId))
        .send(newOccasion);

      occasionId = createResponse.body.id;
    });

    it("should edit an existing occasion with valid data", async () => {
      const updatedData = {
        name: "Updated Occasion Name",
        occasionType: OccasionType.Birthday,
        month: Month.December,
        day: 25,
      };

      const response = await request(app)
        .put(`${path}/${occasionId}`)
        .set("Authorization", getAuthHeader(testUserId))
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', occasionId);
      expect(response.body).toHaveProperty('userId', testUserId);
      expect(response.body).toHaveProperty('name', updatedData.name);
      expect(response.body).toHaveProperty('occasionType', updatedData.occasionType);
      expect(response.body).toHaveProperty('month', updatedData.month);
      expect(response.body).toHaveProperty('day', updatedData.day);
    });

    it("should return 404 when occasion does not exist", async () => {
      const nonExistentId = "non-existent-id-123";
      const updatedData = {
        name: "Updated Name",
        occasionType: OccasionType.Birthday,
        month: Month.January,
        day: 1,
      };

      const response = await request(app)
        .put(`${path}/${nonExistentId}`)
        .set("Authorization", getAuthHeader(testUserId))
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Occasion not found');
    });

    it("should return 400 when required fields are missing", async () => {
      const invalidData = {
        name: "Updated Name",
        // Missing occasionType, month, and day
      };

      const response = await request(app)
        .put(`${path}/${occasionId}`)
        .set("Authorization", getAuthHeader(testUserId))
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('missing or incorrect');
    });

    it("should return 400 when day is out of valid range", async () => {
      const invalidData = {
        name: "Updated Name",
        occasionType: OccasionType.Birthday,
        month: Month.January,
        day: 0, // Invalid: day must be between 1 and 31
      };

      const response = await request(app)
        .put(`${path}/${occasionId}`)
        .set("Authorization", getAuthHeader(testUserId))
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
