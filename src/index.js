const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDb } = require("./utils/connectDb");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

dotenv.config();

const PORT = 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Listenning on port ${PORT}`); // listen on port
  connectDb();
});
