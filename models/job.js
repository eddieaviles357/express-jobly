"use strict";

const db = require("../db");

class Job {
    static async create({title}) {
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
        VALUES ($1, $2, $3, $4, $5)
        RETURNING title, salary, equity, company_handle`,
        [
            title,
            salary,
            equity,
            company_handle
        ]);
        console.log(result.rows[0])
    };

    static async get() {

    }

    static async update() {

    }

    static async remove() {

    }
}

module.exports = Job;