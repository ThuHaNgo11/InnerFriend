const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken")

mongoose.connect("mongodb+srv://21520131:ttFlCRmjHJ8KkGV3@cluster0.8c3rx6z.mongodb.net/").then(() => {
    console.log("Connected to Mongodb")
}).catch(e => {
    console.log("Error connecting to Mongodb", e)
})

app.listen(port, () => {
    console.log("Server is running on port 3000")
})

// import mongodb collections
const User = require("./models/user")
const Journal = require("./models/journal")

// endpoints
// Register 
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        ///check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already registered");
        }

        const newUser = new User({
            name,
            email,
            password,
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
            return res.status(401).json({ message: "Invalid Email" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalide password" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);

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

// Create journal
app.post('/user/:userId/journals', async(req, res) => {
    try {
        const userId = req.params.userId;
        const { title, content, date } = req.body;

        const newJournal = new Journal({
            title,
            content,
            createdAt: date
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
        const user = await User.findById(userId).populate("journals");

        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        res.status(200).json({ journals: user.journals });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong :(" })
    }
})