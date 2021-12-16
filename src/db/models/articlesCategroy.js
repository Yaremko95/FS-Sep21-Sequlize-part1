import sequelize from "../index.js";

import s from "sequelize";

const { DataTypes } = s;

const ArticleCategory = sequelize.define(
  "articleCategory",
  {
    // isPopular: {
    //   type: DataTypes.BOOLEAN,
    // },
  },
  {
    timestamps: false,
  }
);

export default ArticleCategory;
