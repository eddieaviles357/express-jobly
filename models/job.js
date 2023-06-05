"use strict";

const db = require("../db");

class Job {
    static async create({title, salary, equity, company_handle}) {
    const duplicateCheck = await db.query(
        `SELECT title
            FROM jobs
            WHERE title = $1`,
        [title]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${title}`);

    const result = await db.query(
        `INSERT INTO jobs
        (title, salary, equity, company_handle)
        VALUES ($1, $2, $3, $4)
        RETURNING title, salary, equity, company_handle`,
        [
            title,
            salary,
            equity,
            company_handle
        ]);
        const job = result.rows[0];
        console.log('Job MODLE:::', job)
        return job;
    };

    static async get() {

    }

    static async update() {

    }

    static async remove() {

    }
}

module.exports = Job;