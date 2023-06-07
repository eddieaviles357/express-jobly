"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {
        title: "Tester",
        salary: 99999,
        equity: "0", // When using NUMERIC with postgresql it gets treated as a string
        company_handle: "new",
      };

    test("ok for Admin users", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        console.log(resp);
        expect(resp.statusCode).toEqual(201);
        // const { id, title, salary, equity, company_handle } = resp;

        // expect(id).toEqual(expect.any(Number));
        
        // expect({title, salary, equity, company_handle}).toEqual({
        //     job: newJob,
        // });
    });
});
  
/************************************** GET /jobs */


/************************************** GET /jobs/:id */


/************************************** PATCH /jobs/:id */



/************************************** DELETE /jobs/:id */