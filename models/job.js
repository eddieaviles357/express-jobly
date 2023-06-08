"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { BadRequestError, NotFoundError } = require("../expressError");
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
    
    /** Given a job id, return data about the job.
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws NotFoundError if not found.
   **/
    static async get(id) {
        const jobRes = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE id = $1`,
            [id]);

        const job = jobRes.rows[0];

        if (!job) throw new NotFoundError(`No job: ${id}`);

        return job;
    };

    /** Given an object, return sql paremeterized query string.
   * data should be an object with 1 - 3 key values 
   * title is case insensitive
   * 
   * data can be { title: 'developer', minSalary: 100, hasEquity: 910 }
   * 
   * Returns [{ handle, title, description, numEmployees, logoUrl }, ...]
   *
   * Throws NotFoundError if not found.
   **/
  static async getByFilter(query) {
    const {title} = query;
    // does title exist in the query
    // replace query title value so we can query using ILIKE instead
    if(title) query['title'] = `%${query['title']}%`
    // grab keys and values from query obj
    let keys = Object.keys(query);
    let values = Object.values(query);

    // we are only going to worry about 3 field title, minSalary, hasEquity
    // iterate keys and return valid paremeterized query string
    // if key hasEquity exist remove the value that was extracted from values array
    let cols = keys.map((colName, idx) => {
        if(colName === 'title') return `${(idx>0)?'AND ':''}${colName} ILIKE $${idx + 1}`;

        if(colName === 'minSalary') return `${(idx>0)?'AND ':''}salary >= $${idx + 1}`;
        // remove value from values array if hasEquity exist
        if(colName === 'hasEquity' && query['hasEquity']) {
            values = values.filter( val => val !== query['hasEquity'] );
            return `${(idx>0)?'AND ':''}equity > 0`;
        };
    });
    // join cols as one big query string
    cols = cols.join(' ');
    // query jobs using values
    const jobsRes = await db.query(
      `SELECT id, title, salary, equity, company_handle
       FROM jobs
       WHERE ${cols}`,
    values);

    const jobs = jobsRes.rows;

    if (jobs.length === 0) throw new NotFoundError(`No job found`);

    return jobs;
  }

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
  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/
    static async remove(id) {
        const result = await db.query(
            `DELETE
                FROM jobs
                WHERE id = $1
                RETURNING id,title`,
            [id]);
        const job = result.rows[0];
        if(!job) throw new NotFoundError(`No job: ${id}`);
    }
}

module.exports = Job;