"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const Company = require("./company.js");

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

/************************************** create */

describe("create", function () {
  const newCompany = { 
    handle: "new",
    name: "New",
    description: "New Description",
    numEmployees: 1,
    logoUrl: "http://new.img",
  };
  const newJob = {
    title: "Tester",
    salary: 99999,
    equity: "0", // When using NUMERIC with postgresql it gets treated as a string
    company_handle: "new",
  };
  test("works", async function () {
    // must add to db since job references company_handle
    await Company.create(newCompany);
    
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);
    
    const result = await db.query(
      `SELECT title, salary, equity, company_handle
      FROM jobs
      WHERE title = 'Tester'`);
      expect(result.rows).toEqual([
        {
          title: "Tester",
          salary: 99999,
          equity: "0",
          company_handle: "new",
        },
      ]);
    });
  });
  
  
  /************************************** get */

  describe("findAll", function() {
    test("get all jobs", async function () {
      const results = await Job.findAll();
      expect(results).toEqual([
        {
          title: 'Software Engineer',
          salary: 110000,
          equity: '0',
          company_handle: 'c1'
        },
        {
          title: 'Web Developer',
          salary: 100000,
          equity: '0',
          company_handle: 'c2'
        },
        {
          title: 'UI/UX Designer',
          salary: 90000,
          equity: '0',
          company_handle: 'c3'
        }
      ]);
    })
  })