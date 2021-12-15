import { Sequelize } from "sequelize";

const { DB_URL } = process.env;

const sequelize = new Sequelize(DB_URL);

export const testDB = async () => {
  try {
    await sequelize.authenticate({ logging: false });
    console.log("DB is authenticated");
  } catch (error) {
    console.log("Failed to authenticate", error);
  }
};

export default sequelize;
