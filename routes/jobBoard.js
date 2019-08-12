const express = require('express');
const router = express.Router();

const JobBoardModel = require ('../models/jobBoard');

router.get('/home', (req, res, next) => {
    res.send("Welcome to my API").status(200);
});

//read all
router.get("/all", async (req, res, next) => {
    const allJobs = await JobBoardModel.getAll();
    res.json(allJobs).status(200);
});

router.get("/jobs/:jobboard_id?", async (req, res, next) => {
    console.log('req.params', req.params);
    const jobboardId = req.params.jobboard_id;
    const theJob = await JobBoardModel.getJobById(jobboardId);
    res.json(theJob).status(200);
});


//get jobs by date
router.get('/jobs/date/:date?', async (req, res, next) => {
    const date = req.params.date;
    const thedate = await JobBoardModel.getByDate(date);
    res.json(thedate).status(200);
});

//delete job
router.get("/delete/:jobboard_id?", async (req, res, next) => {
    const jobboardId = req.params.jobboard_id;
    const response = await JobBoardModel.deleteJob(jobboardId);
    console.log("response", response)
    if (response.command === "DELETE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not delete jobboardId: ${jobboardId}`).status(409);
    }
});

//create new jobboard
router.post("/post/add", async (req,res) => {
    const { date, jobtype, employee, comments, jobboardId } = req.body;
    const response = await JobBoardModel.addNewJobBoard(date, jobtype, employee, comments, jobboardId);
    (response.command === "INSERT" && response.rowCount >= 1) ? res.sendStatus(200) : res.send(`Could not add new jobboardId ${jobboardId}`).status(409);
});

//update jobboard
router.put("/jobs/update/:jobboard_id?", async (req, res) => {
    const jobboardId = req.params.jobboard_id;
    console.log(req.body);
    const { date, jobtype, employee, comments } = req.body;
    const response = await JobBoardModel.updateJobBoard(date, jobtype, employee, comments, jobboardId);
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update jobboardId ${jobboardId}`).status(409);
    } 
});

module.exports = router;