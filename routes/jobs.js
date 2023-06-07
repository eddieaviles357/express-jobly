"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobsNewSchema = require("../schemas/jobsNew.json");

const router = new express.Router();


/** POST / { job } =>  { job }
 *
 * job should be { title, salary, equity, company_handle }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Authorization required: login
 */

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobsNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      
      const job = await Job.create(req.body);
      return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/", async (req, res, next) => {
    let jobs = null;
    try {
      jobs = await Job.findAll();
      return res.json({ jobs });
    } catch(err) {
      return next(err);
    }
  });

  

module.exports = router;