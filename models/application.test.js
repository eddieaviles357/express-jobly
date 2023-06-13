"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Application = require("./application.js");
const User = require("./user.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** applyJob */

describe("applyJob", function () {
  test("works", async function () {
      const user = await User.register({ 
          username:'t1', 
          password: 'password1', 
          firstName: 't1', 
          lastName:'t1', 
          email: 't1@t1.com', 
          isAdmin: false 
      });
    const job = await Job.findAll();
    const res = await Application.applyJob({username: user['username'], id: job[0].id});
    expect(res).toEqual(job[0].id);
  });
});

/************************************** remove */
