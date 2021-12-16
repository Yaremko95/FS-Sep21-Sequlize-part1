import sequelize from "../index.js";

import s from "sequelize";

const { DataTypes } = s;

const Category = sequelize.define("category", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Category;
