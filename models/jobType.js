const db = require('./conn.js');

class JobType {
    constructor(id, jobType, instructions) {
        this.id = id;
        this.jobType = jobType;
        this.instructions = instructions;
    }

    static async getAll() {
        try {
            const response = await db.any(`select * from jobtype;`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async getById(jobtype_id) {
        try {
            const response = await db.one(`select * from jobtype where id = ${jobtype_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async deleteJob(jobtype_id) {
        try {
            const response = await db.result(`delete from jobtype where id = ${jobtype_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async addNewJobType(jobType, instructions) {
        const query = `insert into jobtype
        (jobType, instructions)
    Values ('${jobType}', '${instructions}')`;
        try {
            let response = await db.result(query);
            return response;
        } catch (err) {
            console.log('Error', err.message);
            return err;
        }
    }

    static async updateJobType(jobType, instructions, jobtypeId) {
        const query = `
            UPDATE jobtype
            SET 
            jobtype = '${jobType}', 
            instructions = '${instructions}'
            WHERE 
                id = '${jobtypeId}'`;
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

module.exports = JobType;