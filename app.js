const express = require("express");
const bodyParser = require("body-parser");
const postsRoutes = require("./Routes/Post_route.js"); 
const userRoutes = require("./Routes/userRoutes.js");
const commentsRoutes = require("./Routes/Comments_route.js");
const authRoutes = require("./Routes/authroutes.js")
const { sequelize, testConnection } = require("./Config/database");
const Admins = require("./models/Admins");
const Clubs = require("./models/Clubs");
const Comments = require("./models/Comments");
const Event = require("./models/Event");
const Magazines = require("./models/Magazines");
const Posts = require("./models/Posts");
const Users = require("./models/Users");
const { clerkClient } = require("./Config/client.js");
const verifier = require("./middlewares/middleware.js");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(authRoutes);
app.use("/api", verifier, postsRoutes);
app.use("/api", verifier, userRoutes);
app.use("/api", verifier, commentsRoutes);

// Public routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Define associations
Comments.belongsTo(Posts, { foreignKey: "postId" });
Comments.belongsTo(Users, { foreignKey: "userId" });
Clubs.belongsTo(Users, { foreignKey: "admin" });
Magazines.belongsTo(Admins, { foreignKey: "owner" });
Posts.belongsTo(Users, { foreignKey: "authorId" });

Posts.hasMany(Comments, { foreignKey: "postId", as: "postComments" });
Users.hasMany(Comments, { foreignKey: "userId", as: "userComments" });
Users.hasMany(Clubs, { foreignKey: "admin", as: "adminClubs" });
Admins.hasMany(Magazines, { foreignKey: "owner", as: "ownedMagazines" });
Users.hasMany(Posts, { foreignKey: "authorId", as: "userPosts" });

// Test database connection and sync models
const initializeDatabase = async () => {
  try {
    await testConnection();
    console.log("Connection to the database has been established successfully.");

    await sequelize.sync(); // force: true will drop tables if they exist, use it carefully
    console.log("Database and tables have been synced successfully.");
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
};

initializeDatabase();

// Start the server
// const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server is running on http://127.0.0.1:${3000}`);
});
