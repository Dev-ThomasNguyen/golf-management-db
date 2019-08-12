const db = require('./conn.js');

class YourCourse {
    constructor(id, clubName, admin, employees, city, state) {
        this.id = id;
        this.clubname = clubName;
        this.admin = admin;
        this.employees = employees;
        this.city = city;
        this.state = state;
    }

    static async getAll() {
        try {
            const response = await db.any(`select * from yourcourse;`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async getById(course_id) {
        try {
            const response = await db.one(`select * from yourcourse where id = ${course_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async deleteCourse(course_id) {
        try {
            const response = await db.result(`delete from yourcourse where id = ${course_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async updateCourse(courseId, clubName, admin, employees, city, state) {
        const query = `
            UPDATE yourcourse
            SET 
                clubname = '${clubName}', 
                admin = '${admin}', 
                employees = '${employees}', 
                city = '${city}', 
                state = '${state}'

            WHERE 
                id = ${courseId}`;
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

module.exports = YourCourse;