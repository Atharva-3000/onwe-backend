const { clerkClient } = require("../Config/client");
const Users = require("../models/Users");
const verifier = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const session = await clerkClient.verifyToken(token);
    console.log(session);
      const user = await Users.findOne({ where: { id: session.payload.userId } });
    // console.log(await Users.findAll(
    //   {
    //     where: {
    //       id: session.userId
    //     }
    //   }
    // ))
    console.log(user);
    if (user) {
      console.log(session.userId);
    // Attach user to request
      next();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = verifier;
