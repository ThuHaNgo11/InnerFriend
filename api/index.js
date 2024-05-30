const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();
const util = require('util');
const app = express();
const port = 3000;
const cors = require("cors");
const bcrypt = require('bcrypt');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken")

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Connected to Mongodb")
}).catch(e => {
    console.log("Error connecting to Mongodb: ", e)
})

app.listen(port, () => {
    console.log("Server is running on port 3000")
})

// import mongodb collections
const User = require("./models/user")
const Journal = require("./models/journal")

// Register 
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, createdAt } = req.body;

        // check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already registered");
        }
        const salt = bcrypt.genSaltSync() //more secure
        const encryptedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: encryptedPassword,
            createdAt
        });

        await newUser.save();

        res.status(202).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("Error registering the user", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

const secretKey = generateSecretKey();

// Log in
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const checkPassword = bcrypt.compareSync(password, user.password)

        if (!checkPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }    

        const token = jwt.sign({ userId: user._id }, secretKey, {
            expiresIn: '30d'
        });

        // send id to be kept in asyncStorage
        res.status(200).json({ token: token, id: user._id });
    } catch (error) {
        console.log("Login failed", error);
        res.status(500).json({ message: "Login failed" });
    }
});

// get user by id
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: error.toString() })
    }
})

// update user profile image
app.put('/user/:id', async (req, res) => {
    try {
        // filter input to get the profilePhotoUrl only
        // to avoid modifying other fields
        const { profilePhotoUrl } = req.body

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { profilePhotoUrl }, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({ error: error.toString() })
    }
})

// Create journal
app.post('/user/:userId/journals', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { title, content, date, uploadedUrl } = req.body;

        const newJournal = new Journal({
            title,
            content,
            createdAt: date,
            imageUrl: uploadedUrl
        });

        // add journal to the existing journals collection
        await newJournal.save();

        // add journal to the journals array in the user table (user collection)
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "user not found" })
        }

        user.journals.push(newJournal._id)
        await user.save()

        res.status(200).json({ message: "Journal added successfully", journal: newJournal })
    } catch (e) {
        res.status(500).json({ message: "journal not added" })
    }
})

// fetch journals 
app.get("/user/:userId/journals", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('journals');

        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        // Return an array with the newest journal first
        const journalArr = user.journals.reverse();
        res.status(200).json({ journals: journalArr });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong :(" })
    }
})

//get individual journal
app.get("/journals/:journalId", async (req, res) => {
    try {
        const journalId = req.params.journalId;
        const journal = await Journal.findById(journalId);

        if (!journal) {
            return res.status(404).json({ error: "journal not found" })
        }

        res.status(200).json({ journal });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Can't get journal" })
    }
})

// delete journal by id
app.delete("/user/:userId/journals/:journalId", async (req, res) => {
    try {
        await Journal.findByIdAndDelete(req.params.journalId);

        // delete the journal id in the array journals of User
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404).json({ error: "user not found" })
        }
        user.journals = user.journals.filter((idObj) => idObj.toString() !== req.params.journalId)
        await user.save()

        res.status(204).json({ message: "journal deleted" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Can't delete journal" })
    }
})

// edit journal
app.put("/journals/:journalId", async (req, res) => {
    try {
        await Journal.findByIdAndUpdate(req.params.journalId, req.body, { new: true });

        res.status(204).json({ message: "journal updated" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Can't delete journal" })
    }
})