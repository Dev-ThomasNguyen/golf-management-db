const express = require('express');
const router = express.Router();

const YourCourseModel = require ('../models/yourCourse');

router.get('/home', (req, res, next) => {
    res.send("Welcome to my API").status(200);
});

router.get("/all", async (req, res, next) => {
    const allCourses = await YourCourseModel.getAll();
    res.json(allCourses).status(200);
});

router.get("/courses/:course_id?", async (req, res, next) => {
    const courseId = req.params.course_id;
    const yourcourse = await YourCourseModel.getById(courseId);
    res.json(yourcourse).status(200);
});

router.get("/delete/:course_id?", async (req, res, next) => {
    const courseId = req.params.course_id;
    const response = await YourCourseModel.deleteCourse(courseId);
    console.log("response", response)
    if (response.command === "DELETE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not delete courseId: ${courseId}`).status(409);
    }
});

router.put("/courses/update/:course_id?", async (req, res) => {
    const courseId = req.params.course_id;
    console.log(req.body);
    const { clubName, admin, employees, city, state } = req.body;
    const response = await YourCourseModel.updateCourse( courseId, clubName, admin, employees, city, state );
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update course id ${courseId}`).status(409);
    } 
});

module.exports = router;
