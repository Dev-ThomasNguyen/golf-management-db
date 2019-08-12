const express = require("express"),
  router = express.Router(),
  bcryptjs = require("bcryptjs"),
  Employee = require("../models/employee"),
  db = require("../models/conn.js"),
  JWT = require("../helpers/jwt"),
  passport = require("passport"),
  GoogleLogin = require("../controllers/googleLogin"),
  FacebookLogin = require("../controllers/facebookLogin"),
  AuthValidator = require("../helpers/authValidator"),
  duration = "1d";
/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ message: "Welcome to my api" }).status(200);
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { session: false })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  FacebookLogin.facebookControllerCallback
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false
  }),
  GoogleLogin.googleCallback
);

router.get("logout", async (req, res) => {
  console.log("logging out");
  req.session.destroy();
});

//get all employees
router.get("/all", async (req, res, next) => {
  const allEmployees = await Employee.getAll();
  res.json(allEmployees).status(200);
});

router.get("/employees/:employee_id?", async (req, res) => {
  const employeeId = req.params.employee_id;
  const theEmployee = await Employee.getById(employeeId);
  res.json(theEmployee).status(200);
});

router.get("/delete/:employee_id?", async (req, res, next) => {
  const employeeId = req.params.employee_id;
  const response = await EmployeeModel.deleteEmployee(employeeId);
  console.log("response", response);
  if (response.command === "DELETE" && response.rowCount >= 1) {
    res.sendStatus(200);
  } else {
    res.send(`Could not delete employeeId: ${employeeId}`).status(409);
  }
});

router.post("/login", AuthValidator.authInputValidator, async (req, res) => {
  try {
    const { email, password } = req.body,
      employeeInstance = new Employee(
        null,
        null,
        null,
        null,
        email,
        password,
        null,
        null,
        null,
        null
      );
    const employeeData = await employeeInstance.getEmployeeByEmail();
    if (employeeData === "No data returned from the query.") {
      return res.status(400).json({
        status: "error",
        message: "invalid user name or password"
      });
    }

    const isValid = await bcryptjs.compareSync(password, employeeData.password);
    delete employeeData.password;
    if (isValid) {
      const token = JWT.generateToken(employeeData, duration);
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        user: employeeData,
        token: token
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "invalid user name or password"
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "invalid user name or password"
    });
  }
});

router.post("/register", AuthValidator.authInputValidator, async (req, res) => {
  const {
    firstname,
    lastname,
    phone,
    email,
    experience,
    datestarted,
    adminstatus,
    course_id,
    password
  } = req.body;

  const hash = bcryptjs.hashSync(password, 10);

  const employeeInstance = new Employee(
    null,
    firstname,
    lastname,
    phone,
    email,
    experience,
    datestarted,
    adminstatus,
    course_id,
    hash
  );
  const employeeData = await employeeInstance.checkIfCreated();
  console.log(employeeData);
  if (employeeData !== "No data returned from the query.") {
    return res.status(409).json({
      status: "error",
      message: "User already exist"
    });
  }
  const user = await employeeInstance.save();
  delete user.password;
  const token = JWT.generateToken(user, duration);

  return res.status(201).json({
    status: "success",
    message: "user created successfully",
    user: user,
    token: token
  });
});

router.put("/employees/update/:employee_id?", async (req, res) => {
  const employeeId = req.params.employee_id;
  console.log(req.body);
  const {
    firstname,
    lastname,
    phone,
    email,
    experience,
    dateStarted,
    course_id,
    password
  } = req.body;
  const response = await EmployeeModel.updateEmployee(
    employeeId,
    firstname,
    lastname,
    phone,
    email,
    experience,
    datestarted,
    adminstatus,
    course_id,
    password
  );
  console.log("response is", response);
  if (response.command === "UPDATE" && response.rowCount >= 1) {
    res.sendStatus(200);
  } else {
    res.send(`Could not update employee id ${employeeId}`).status(409);
  }
});

module.exports = router;
