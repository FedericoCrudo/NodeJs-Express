import request from "supertest";
import app from "../src/app.js";
import { mongoConnect } from "../src/utils/mongo.js";
import { loadPlanetsData } from "../src/models/planets.model.js";

describe("Launches Api", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  //possiamo definire dei gruppi di test
  describe("TEST GET /launches", () => {
    test("it should respond with 200 success", async () => {
      //con supertest possiamo concatenare piu metodi come expect
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      //assetions
      // expect(response.statusCode).toBe(200);
    });
  });
  describe("TEST POST /launches", () => {
    const completeLaunchData = {
      mission: "TEST",
      rocket: "NCC 177",
      target: "Kepler-188",
      launchDate: "January 4, 2028",
    };
    const launchDataWithoutDate = {
      mission: "TEST",
      rocket: "NCC 177",
      target: "Kepler-188",
    };
    const launchWithInvalidDate = {
      mission: "TEST",
      rocket: "NCC 177",
      target: "Kepler-188",
      launchDate: "zoor",
    };
    test("it should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(requestDate).toBe(responseDate);
      //per verificare le property restituite
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test("it should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        status: "failed",
        messsage: "One or more fields is empty",
      });
    });
    test("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        status: "failed",
        messsage: "Invalid launch date",
      });
    });
  });
});
