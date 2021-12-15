import express from "express";
import { Article, User } from "../../db/models/index.js";
const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const articles = await Article.findAll({
        include: User,
      });
      res.send(articles);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const article = await Article.create(req.body);
      res.send(article);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .put(async (req, res, next) => {
    try {
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

export default router;
