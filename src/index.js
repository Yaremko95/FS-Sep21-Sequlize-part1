import express from "express";
import usersRouter from "./services/users/index.js";
import articlesRouter from "./services/articles/index.js";
import reviewsRouter from "./services/reviews/index.js";
import categoriesRouter from "./services/categories/index.js";
import cors from "cors";
import sequelize, { testDB } from "./db/index.js";

const server = express();

server.use(cors());
server.use(express.json());
server.use("/users", usersRouter);
server.use("/articles", articlesRouter);
server.use("/reviews", reviewsRouter);
server.use("/categories", categoriesRouter);

server.listen(process.env.PORT || 3002, async () => {
  console.log("server is running on port ", process.env.PORT || 3002);
  await testDB();
  await sequelize.sync({ logging: false });
});
