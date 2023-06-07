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
    
    let {id, title, salary, equity, company_handle} = await Job.create(newJob);

    expect(id).toEqual(expect.any(Number));
    expect({title, salary, equity, company_handle}).toEqual(newJob);

    
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
  
  
  /************************************** findAll */

  describe("findAll", function() {
    test("get all jobs", async function () {
      const results = await Job.findAll();
      // remove the ids so we can check the values returned from the db
      const reducedRes = results.reduce((acc, job) => {
        const {title, salary, equity, company_handle} = job;
        return [...acc, {title, salary, equity, company_handle}]
    }, [])

      expect(reducedRes).toEqual([
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

 /************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.findAll();
    let jobId = job[1].id;
    
    let {id,title, salary, equity, company_handle} = await Job.get(jobId);

    expect(id).toEqual(jobId);

    expect({id,title, salary, equity, company_handle}).toEqual({
      id: jobId,
      company_handle: "c2",
      title: "Web Developer",
      salary: 100000,
      equity: "0",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Company.get("noway");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

 /************************************** update */

 describe("update", function () {
  const newJobTester = {
    title: "New Tester",
    salary: 111111,
    equity: "0",
    company_handle: "c1",
  };

  const updateData = {
    title: "Test",
    salary: 111,
    equity: "0",
  };

  test("works", async function () {
    // extract id we will use this to update job in db
    let {id, company_handle} = await Job.create(newJobTester);

    let job = await Job.update(id, updateData);
    expect(job).toEqual({
      id,
      company_handle,
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'Test'`);
    expect(result.rows).toEqual([{
      id,
      title: "Test",
      salary: 111,
      equity: "0",
      company_handle: "c1",
    }]);
  });

});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const newJobTester = {
      title: "New Tester",
      salary: 111111,
      equity: "0",
      company_handle: "c1",
    };
    const {id, title, salary, equity, company_handle} = await Job.create(newJobTester);
    expect({title, salary, equity, company_handle}).toEqual(newJobTester);
    await Job.remove(id);
    const res = await db.query(
      "SELECT title, salary, equity, company_handle FROM jobs WHERE id=$1",
      [id]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(1)
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});