const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

//To select ID from MongoDB
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB linking
const uri = `mongodb+srv://suny:Password6251420@collegemanagement.vwy82.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
	try {
		await client.connect();

		//DB Folder and Subfolder
		const database = client.db("smartAttendence");
		const studentsCollection = database.collection("student");
		const teachersCollection = database.collection("teachers");
		const noticesCollection = database.collection("notices");

		/* ------
        ------ login , role, add user
        ------ */
		//To add new user when login or signup
		app.post("/users", async (req, res) => {
			const newuser = req.body;
			console.log("Request from UI ", newuser);
			const result = await usersCollection.insertOne(newuser);
			console.log("Successfully Added New User ", result);
			res.json(result);
		});
		//To update or replace users data when login or signup
		app.put("/users", async (req, res) => {
			console.log(req.body);
			const user = req.body;
			const filter = { email: user?.email };
			console.log("Request to replace or add user", user);
			const options = { upsert: true };
			const updateuser = {
				$set: {
					email: user?.email,
					displayName: user?.displayName,
					photoURL: user?.photoURL,
				},
			};
			const result = await usersCollection.updateOne(
				filter,
				updateuser,
				options,
			);
			res.json(result);
			console.log("Successfully replaced or added user", result);
		});
		//Check Admin or Not
		app.get("/users/:email", async (req, res) => {
			const email = req.params.email;
			console.log("from UI", email);
			const filter = { email: email };
			console.log("Request to find ", filter);
			const user = await usersCollection.findOne(filter);
			console.log(user);
			let isAdmin = false;
			if (user?.userRole === "Admin") {
				isAdmin = true;
			}
			res.json({ admin: isAdmin });
			console.log("Found one", user);
		});

		/* ------
        ------add all
        ------ */

		//To add new students
		app.post("/students", async (req, res) => {
			const newStudent = req.body;
			console.log("Request from UI ", newStudent);
			const result = await studentsCollection.insertOne(newStudent);
			console.log("Successfully Added New student ", result);
			res.json(result);
		});
		//To add new teachers
		app.post("/teachers", async (req, res) => {
			const newTeacher = req.body;
			console.log("Request from UI ", newTeacher);
			const result = await teachersCollection.insertOne(newTeacher);
			console.log("Successfully Added New teacher ", result);
			res.json(result);
		});
		//To add new notice
		app.post("/notices", async (req, res) => {
			const newNotice = req.body;
			console.log("Request from UI ", newNotice);
			const result = await noticesCollection.insertOne(newNotice);
			console.log("Successfully Added New Notice ", result);
			res.json(result);
		});

		/* ------
        ------Show all
        ------ */

		//To Show all students
		app.get("/students", async (req, res) => {
			console.log(req.query);
			const get = studentsCollection.find({});
			console.log("Request to find students");
			students = await get.toArray();
			res.send(students);
			console.log("Found all students", students);
		});
		//To Show all teachers
		app.get("/teachers", async (req, res) => {
			console.log(req.query);
			const get = teachersCollection.find({});
			console.log("Request to find teachers");
			teachers = await get.toArray();
			res.send(teachers);
			console.log("Found all teachers", teachers);
		});
		//To Show all notices
		app.get("/notices", async (req, res) => {
			console.log(req.query);
			const get = noticesCollection.find({});
			console.log("Request to find notices");
			notices = await get.toArray();
			res.send(notices);
			console.log("Found all notices", notices);
		});

		//To load single students by roll
		app.get("/students", async (req, res) => {
			const roll = req.params.id;
			const filter = { id: roll };
			console.log("Request to find ", filter);
			const result = await studentsCollection.findOne(filter);
			res.send(result);
			console.log("Found one", result);
		});

		/* ------
        ------delete all
        ------ */

		//To Delete user one by one
		app.delete("/users/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to delete ", id);
			const deleteId = { _id: ObjectId(id) };
			const result = await studentsCollection.deleteOne(deleteId);
			res.send(result);
			console.log("user Successfully Deleted", result);
		});
	} finally {
		//await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("College Management Server is running just fine");
});

app.listen(port, () => {
	console.log("College Management Server running on port :", port);
});
