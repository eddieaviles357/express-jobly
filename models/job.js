"use strict";

const db = require("../db");

/** related functions for jobs */

class Job {
    /** Create a job (from data), update db, return new job data.
     *
     * data should be { title, salary, equity, company_handle }
     *
     * Returns { title, salary, equity, company_handle }
     *
     * Throws BadRequestError if job already in database.
     * */
    static async create({title, salary, equity, company_handle}) {
        equity = String(equity); // cast number to a string
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

        return job;
    };

    /** Find all jobs.
    *
    * Returns [{ title, salary, equity, company_handle }, ...]
    * */
    static async findAll() {

        const companiesRes = await db.query(
            `SELECT title, salary, equity, company_handle
            FROM jobs
            ORDER BY company_handle`);
        console.log(companiesRes.rows)
        return companiesRes.rows;
    };

    static async update() {

    }

    static async remove() {

    }
}

module.exports = Job;