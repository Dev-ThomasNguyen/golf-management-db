const db = require("./conn.js");

class JobBoard {
  constructor(id, date, jobtype, employee, comments) {
    this.id = id;
    this.date = date;
    this.jobtype = jobtype;
    this.employee = employee;
    this.comments = comments;
  }

  //getall
  static async getAll() {
    try {
      const response = await db.any(`SELECT * FROM jobboard 
            INNER JOIN employee ON jobboard.employee = employee.id`);
      // INNER JOIN jobtype ON jobtype.id = jobboard.jobtype`)
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async getJobById(jobboard_id) {
    try {
      const response = await db.one(`select * from jobboard INNER JOIN employee ON jobboard.employee = employee.id
            where jobboard.id = ${jobboard_id} `);
      console.log(response);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  //delete job
  static async deleteJob(jobboard_id) {
    try {
      const response = await db.result(
        `delete from jobboard where id = ${jobboard_id}`
      );
      return response;
    } catch (err) {
      return err.message;
    }
  }

  //get jobs by date
  static async getByDate(date) {
    try {
      const response = await db.result(
        `select * from jobboard where date = '${date}'`
      );
      return response;
    } catch (err) {
      return err.message;
    }
  }

  //add jobs
  static async addNewJobBoard(date, jobtype, employee, comments) {
    const query = `insert into jobboard
        (date, jobtype, employee, comments)
    Values ('${date}', '${jobtype}', '${employee}', '${comments}')`;
    try {
      let response = await db.result(query);
      return response;
    } catch (err) {
      console.log("Error", err.message);
      return err;
    }
  }

  static async updateJobBoard(date, jobtype, employee, comments, jobboardId) {
    const query = `
            UPDATE jobboard 
            SET 
                date = '${date}', 
                jobtype = ${jobtype}, 
                employee = ${employee}, 
                comments = '${comments}'
            WHERE 
                id = ${jobboardId}`;
    console.log(query);
    try {
      const response = await db.result(query);
      console.log("response", response);
      return response;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = JobBoard;
