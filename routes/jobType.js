const express = require('express');
const router = express.Router();

const JobTypeModel = require ('../models/jobType');

router.get('/home', (req, res, next) => {
    res.send("Welcome to my API").status(200);
});

//read all
router.get("/all", async (req, res, next) => {
    const allJobTypes = await JobTypeModel.getAll();
    res.json(allJobTypes).status(200);
});

router.get("/jobtypes/:jobtype_id?", async (req, res) => {
    const jobtypeId = req.params.jobtype_id;
    const theJobtype = await JobTypeModel.getById(jobtypeId);
    res.json(theJobtype).status(200);
});

//delete job
router.get("/delete/:jobtype_id?", async (req, res, next) => {
    const jobtypeId = req.params.jobtype_id;
    const response = await JobTypeModel.deleteJob(jobtypeId);
    console.log("response", response)
    if (response.command === "DELETE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not delete jobtypeId: ${jobtypeId}`).status(409);
    }
});

//create new jobtype
router.post("/post/add", async (req,res) => {
    const { jobType, instructions } = req.body;
    const response = await JobTypeModel.addNewJobType(jobType, instructions);
    (response.command === "INSERT" && response.rowCount >= 1) ? res.sendStatus(200) : res.send(`Could not add new jobtype ${jobtypeId}`).status(409);
});

//update jobtype
router.put("/jobtypes/update/:jobtype_id?", async (req, res) => {
    const jobtypeId = req.params.jobtype_id;
    console.log(req.body);
    const { jobType, instructions } = req.body;
    const response = await JobTypeModel.updateJobType(jobType, instructions, jobtypeId);
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update jobtypeId ${jobtypeId}`).status(409);
    } 
});

module.exports = router;