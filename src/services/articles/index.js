import express from "express";
import { articles } from "../../data/articles.js";
import {
  Article,
  User,
  Review,
  ArticleCategory,
  Category,
} from "../../db/models/index.js";
import { Op } from "sequelize";

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const articles = await Article.findAll({
        include: [
          {
            model: Category,
            through: { attributes: [] }, // include category without join table
            // attributes: { exclude: ["createdAt", "updatedAt"] }, //exclude attributes from included Category table

            //filters by Category
            where: {
              ...(req.query.category && {
                // if there is category in the filter
                name: {
                  [Op.in]: req.category.name.split(","), // operator to filter by multiple category ( &category=Sql,React.js)
                },
              }),
            },
          },
          { model: Review, include: User }, // includes related review with User who wrote the Review
          User,
        ],
        where: {
          ...(req.query.search && {
            //filters to serach by title OR content OR name (in included User)
            [Op.or]: [
              {
                title: { [Op.iLike]: `%${req.query.search}%` },
              },
              {
                content: { [Op.iLike]: `%${req.query.search}%` },
              },

              //Option 1
              {
                "$user.name$": {
                  //syntax to filters on included table because name of the User doesn't exist on Article table
                  [Op.iLike]: "%" + req.query.search + "%",
                },
              },
              //Option 2
              // {
              //   name: Sequelize.where(Sequelize.col(`"user.name"`), {
              //     [Op.iLike]: "%" + req.query.search + "%",
              //   }),
              // },
            ],
          }),

          // ...(req.query.category && {
          //   category: {
          //     [Op.in]: req.query.category.split(","),
          //   },
          // }),
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
      console.log(req.body);

      /*
      Sample body in the request

       {
        "title": "React State",
        "content":
        "React components has a built-in state object. The state object is where you store property values that belongs to the component. When the state object changes, the component re-renders.",
        "readTimeValue": 10,
        "userId": "87c58d3e-2384-4ff7-b05a-e79e2cbd6abe",
        "categoryId":["d841930a-0d1d-4d90-8b04-631d4052870d","53281951-0c11-4b74-82a8-e828dfde912e"]
        }
      
      */

      // STEP 1.
      const { categoryId, ...rest } = req.body; //destructures categoryId from the body

      /*
      console.log(rest) 

       {
        "title": "React State",
        "content":
        "React components has a built-in state object. The state object is where you store property values that belongs to the component. When the state object changes, the component re-renders.",
        "readTimeValue": 10,
        "userId": "87c58d3e-2384-4ff7-b05a-e79e2cbd6abe",
      
        }
      */

      // STEP 2.
      const article = await Article.create(rest); //inserts in the Article body EXCEPT categoryID

      //If article is inserted?
      if (article) {
        console.log(article.id);

        /*
        STEP 3.

        FROM: 
        ["d841930a-0d1d-4d90-8b04-631d4052870d","53281951-0c11-4b74-82a8-e828dfde912e"]
        TO:
        [
          {
            categoryId: 'd841930a-0d1d-4d90-8b04-631d4052870d',
            articleId: '9327f779-23f1-4b74-a245-69f6eec3730f'
          },
          {
            categoryId: '53281951-0c11-4b74-82a8-e828dfde912e',
            articleId: '9327f779-23f1-4b74-a245-69f6eec3730f'
          }
        ]

        */
        const dataToInsert = categoryId.map((id) => ({
          categoryId: id,
          articleId: article.id,
        }));

        // STEP 4.

        // inserts modified array to ArticleCategory
        const data = await ArticleCategory.bulkCreate(dataToInsert);
        res.send({ article, articleCategory: data });
      }
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
      const data = await Article.findOne({
        where: {
          id: req.params.id,
        },
        include: [User, Review],
      });
      res.send(data);
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
