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
        company_handle: "c1",
      };

    test("ok for Admin users", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(201);

        const {id, title, salary, equity, company_handle} = resp.body.job;
        expect(id).toEqual(expect.any(Number));
        
        expect({title, salary, equity, company_handle}).toEqual(newJob);
    });

    test("bad request for non Admin users", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send(newJob)
          .set("authorization", `Bearer ${u2Token}`);
      expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            company_handle: "err",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            ...newJob,
            handle: "doesnt exist",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
});
  
/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");

    const jobs = resp.body.jobs.reduce((jobs, next) => {
      const { title, salary, equity, company_handle } = next;
      return [ ...jobs, {title, salary, equity, company_handle} ];
    }, [])
    
    expect(jobs).toEqual([
      {
        title: "testerJob1",
        salary: 123123,
        equity: "0",
        company_handle: "c1",
      },
      {
        title: "testerJob2",
        salary: 100000,
        equity: "0",
        company_handle: "c2",
      },
      {
        title: "testerJob3",
        salary: 200000,
        equity: "0",
        company_handle: "c3",
      },
    ]);
  });
});
/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const jobsResp = await request(app).get("/jobs");
    const jobId = jobsResp.body.jobs[0].id;

    const resp = await request(app).get(`/jobs/${jobId}`);
    expect(resp.body).toEqual({
      job: {
        id: jobId,
        title: "testerJob1",
        salary: 123123,
        equity: "0",
        company_handle: "c1",
      },
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/999999999`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */



/************************************** DELETE /jobs/:id */