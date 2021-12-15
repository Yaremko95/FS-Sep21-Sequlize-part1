import sequelize from "../index.js";
import s from "sequelize";
const { DataTypes } = s;

const Article = sequelize.define(
  "article",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    readTimeValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }
  //   {
  //     timestamps: false,
  //   }
);

export default Article;
