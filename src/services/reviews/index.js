import express from "express";
import { articles } from "../../data/articles.js";
import { Article, User, Review } from "../../db/models/index.js";
import { Op, fn, col } from "sequelize";
import { reviews } from "../../data/reviews.js";
const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Review.findAll({
        include: [Article, User],
      });
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await Review.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

router.route("/bulk").post(async (req, res, next) => {
  try {
    const data = await Review.bulkCreate(reviews);
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.route("/stats").get(async (req, res, next) => {
  try {
    // 1. group reviews my user
    // select reviews."userId", count(id) from reviews group by reviews."userId"

    const reviewsByUser = await Review.findAll({
      attributes: ["userId", [fn("COUNT", col("review.id")), "totalReviews"]],
      group: ["userId"],
    });

    // 2. Group users by reviews and include USER
    // select reviews."userId",users.id, users.name, users.email, count(reviews.id) from reviews
    // left join users
    // on reviews."userId" = users.id group by reviews."userId", users.id

    const reviewsByUserIncluding = await Review.findAll({
      include: User,
      attributes: ["userId", [fn("COUNT", col("review.id")), "totalReviews"]],
      group: ["userId", "user.id"],
    });

    //group reviews by article

    const reviewsByArticleIncludingArticle = await Review.findAll({
      include: [{ model: Article, include: User }],
      attributes: [
        "articleId",
        [fn("COUNT", col("review.id")), "totalArticles"],
      ],
      group: ["articleId", "article.id", "article->user.id"],
    });

    //get AVG rate of each article

    const data = await Review.findAll({
      include: { model: Article, include: User },
      attributes: ["articleId", [fn("avg", col("rate")), "avarageRate"]],
      group: ["articleId", "article.id", "article->user.id"],
    });

    res.send({ data1 });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Review.findByPk(req.params.id);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .put(async (req, res, next) => {
    try {
      const { body } = req;

      delete body.userId;
      delete body.articleId;

      const data = await Review.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const data = await Review.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.send({ rows: data });
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

export default router;
