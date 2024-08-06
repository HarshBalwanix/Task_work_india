const { sequelize } = require("./models/index");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");

const db = require("./models");

db.sequelize.sync().then((req) => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
