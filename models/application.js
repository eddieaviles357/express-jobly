"use strict";

const db = require("../db");

const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

/** Related functions for application. */

class Application {

  /** creates an application to job given {username, jobId} => jobId
   * 
   * Returns job id
   * 
   * throws NotFoundError if no job exist
   */

  static async applyJob({username, id}) {
    const duplicateCheck = await db.query(
      `SELECT username, job_id
       FROM applications
       WHERE username = $1 
       AND job_id = $2`,
      [username, id],
    );
    
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username} id: ${id}`);
    }

    const result = await db.query(
      `INSERT INTO applications (username, job_id)
       VALUES ($1, $2)
       RETURNING job_id`, 
       [username, id]
    );

    const {job_id} = result.rows[0];

    if(!job_id) throw new NotFoundError(`No job: ${id}`);

    return job_id;
  }

/** Delete given application from database; returns undefined. */

  static async remove({username, job_id}) {
    let result = await db.query(
          `DELETE
           FROM applications
           WHERE username = $1 AND job_id = $2
           RETURNING job_id`,
        [username, job_id],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username} id: ${job_id}`);
  }
}


module.exports = Application;
