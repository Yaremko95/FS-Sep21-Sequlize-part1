import express from "express";
import { articles } from "../../data/articles.js";
import { Article, User } from "../../db/models/index.js";
import { Op, Sequelize } from "sequelize";
const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const articles = await Article.findAll({
        include: User,
        where: {
          ...(req.query.search && {
            [Op.or]: [
              {
                title: { [Op.iLike]: `%${req.query.search}%` },
              },
              {
                content: { [Op.iLike]: `%${req.query.search}%` },
              },
              // {
              //   [Sequelize.col("user.lastName")]: {
              //     [Op.iLike]: `%${req.query.search}%`,
              //   },
              // },
            ],
          }),

          ...(req.query.category && {
            category: {
              [Op.in]: req.query.category.split(","),
            },
          }),
        },
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

router.route("/bulk").post(async (req, res, next) => {
  try {
    const data = await Article.bulkCreate(articles);

    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
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
