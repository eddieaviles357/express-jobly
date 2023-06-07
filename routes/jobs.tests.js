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
  
});
  
/************************************** GET /jobs */


/************************************** GET /jobs/:id */


/************************************** PATCH /jobs/:id */



/************************************** DELETE /jobs/:id */