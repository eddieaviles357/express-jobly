"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** related functions for jobs */

class Job {
    /** Create a job (from data), update db, return new job data.
     *
     * data should be { title, salary, equity, company_handle }
     *
     * Returns { id, title, salary, equity, company_handle }
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
            RETURNING id,title, salary, equity, company_handle`,
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
    * Returns [{ id, title, salary, equity, company_handle }, ...]
    * */
    static async findAll() {

        const jobRes = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            ORDER BY company_handle`);

            return jobRes.rows;
    };
    
    /** Given a job title, return data about the job.
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws NotFoundError if not found.
   **/
    static async get(title) {
        const jobRes = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE title = $1`,
            [title]);

        const job = jobRes.rows[0];

        if (!job) throw new NotFoundError(`No job: ${title}`);

        return job;
    };

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, company_handle}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data,{});
    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${id} 
                      RETURNING 
                        id, 
                        title, 
                        salary, 
                        equity, 
                        company_handle`;
    const result = await db.query(querySql, [...values]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No id: ${id}`);

    return job;
  };

    static async remove() {

    }
}

module.exports = Job;