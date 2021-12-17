import express from "express";
import { users } from "../../data/users.js";
import { User, Article } from "../../db/models/index.js";
import { Op, fn, col } from "sequelize";

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll({
        //  attributes: ["id", "name", "email"],
        where: {
          ...(req.query.search && {
            [Op.or]: [
              {
                name: { [Op.iLike]: `%${req.query.search}%` },
              },
              {
                email: { [Op.iLike]: `%${req.query.search}%` },
              },
              {
                lastName: { [Op.iLike]: `%${req.query.search}%` },
              },
            ],
          }),
          ...(req.query.age && {
            age: {
              [Op.between]: req.query.age.split(","), // filters by age range
            },
          }),
        },
        // order: [["age", "DESC"]],
        // attributes: { exclude: ["age", "country"] },
        include: [
          { model: Article, attributes: { exclude: ["readTimeValue"] } },
        ],

        // //Pagination
        // limit: req.query.limit, // number of records per page
        // offset: parseInt(req.query.limit * req.query.page), // number f records skipped from 0
      });

      res.send(users);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      console.log(req.body);
      const data = await User.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

router.route("/bulk").post(async (req, res, next) => {
  try {
    const data = await User.bulkCreate(users);
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.route("/stats").get(async (req, res, next) => {
  try {
    //counts all the users in db
    // select count(id) from users;

    const totalUsers = await User.count();

    //select count(id) from users where country='Italy';
    const totalInItaly = await User.count({ where: { country: "Italy" } });

    // select country, count(id) as total from users group by country order by total DESC;

    const groupedBuCountry = await User.findAll({
      attributes: ["country", [fn("COUNT", col("id")), "total"]],
      group: "country",
      order: [[col("total"), "DESC"]],
    });

    // select max(age) from users
    const maxAge = await User.max("age");

    const minAge = await User.min("age");

    // select country, avg(age) as avarage from users group by country
    const avgAgeByCountry = await User.findAll({
      attributes: ["country", [fn("AVG", col("age")), "avgAge"]],
      group: "country",
    });

    // select country, min(age) as minAge from users group by country
    const minAgeByCountry = await User.findAll({
      attributes: ["country", [fn("min", col("age")), "youngest"]],
      group: "country",
    });

    res.send({ maxAge, minAge, avgAgeByCountry, minAgeByCountry });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("Not found");
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .put(async (req, res, next) => {
    try {
      const updateUser = await User.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });

      res.send(updateUser[1][0]);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await User.destroy({
        where: {
          id: req.params.id,
        },
      });

      if (result > 0) {
        res.send("ok");
      } else {
        res.status(404).send("not found");
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

export default router;
