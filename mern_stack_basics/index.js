const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON body

const USERS = []; // Array to store users
const SUBMISSIONS = [];// all submitted solutions by users

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

app.post('/signup', function (req, res) {
  const { email, password, role } = req.body; // Decode body

  // Check if the email and password are provided
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // Check if a user with the given email already exists
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    return res.status(409).send('User with this email already exists'); // Conflict
  }

  // Store the new user in the USERS array
  USERS.push({ email, password, role });

  // Return a success response
  res.status(200).send('User signed up successfully');
});


app.post('/login', (req, res) => { 
const { email, password, role } = req.body;
// Check if the email and password are provided
if (!email || !password) {
    return res.status(400).send('Email and password are required');
}


// Check if a user with the given email already exists
const userExists = USERS.some(user => user.email !== email || user.password !== password); 

if (userExists) {
    return res.status(401).send('User or password is incorrect'); // Conflict
}
const token = Math.random().toString(36).substring(2); // Random string token
// Return 200 status with a token
return res.status(200).json({ message: 'Login successful', token });
})

app.get('/questions', (req, res) => {
    res.status(200).json(QUESTIONS);})
  
// Route to get all submissions
app.get("/submissions", function (req, res) {
    res.status(200).json(SUBMISSIONS); // Return all submissions
  });

  app.post("/submissions", function (req, res) {
    const { email, problemId, solution } = req.body;
  
    // Validate input
    if (!email || !problemId || !solution) {
      return res.status(400).json({ error: "Email, problem ID, and solution are required" });
    }
  
    // Randomly accept or reject the solution
    const isAccepted = Math.random() < 0.5;
  
    // Store the submission
    SUBMISSIONS.push({ email, problemId, solution, isAccepted });
  
    res.status(200).json({
      message: isAccepted ? "Solution accepted!" : "Solution rejected.",
      submission: { email, problemId, solution, isAccepted }
    });
  });


  // Route to add a new problem (admin-only)
app.post("/problems", function (req, res) {
    const { email, password, problem } = req.body;
  
    // Validate input
    if (!email || !password || !problem) {
      return res.status(400).json({ error: "Email, password, and problem details are required" });
    }
  
    // Authenticate admin
    const user = USERS.find(u => u.email === email && u.password === password);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized access. Only admins can add problems." });
    }
  
    // Add the new problem
    QUESTIONS.push(problem);
    res.status(200).json({ message: "Problem added successfully!", QUESTIONS });
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})