const express = require("express");
// for psql database
const Sequelize = require("sequelize-cockroachdb");
const { Op } = require("sequelize");
require("dotenv").config();

// connecting database
var sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      // For secure connection:
      /*ca: fs.readFileSync('certs/ca.crt')
                  .toString()*/
    },
  },
  logging: false,
});

// initializing table
const Probabilities = sequelize.define("probabilities", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  prob: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// end points
app.get("/", (req, res) => {
  res.send("server working");
});

app.post("/add", async (req, res) => {
  const { url, prob } = req.body;

  await Probabilities.create({
    url,
    prob,
  });

  res.status(200).json({
    body: "success",
  });
});

app.post("/getAverage", async (req, res) => {
  const { url } = req.body;
  const { count, rows } = await Probabilities.findAndCountAll({
    where: {
      url: {
        [Op.eq]: url,
      },
    },
    attributes: ["prob"],
  });

  let sum = 0;
  for (row of rows) sum += row.prob;
  let avg = sum / count;

  res.status(200).json({
    body: "success",
    avg,
  });
});

Probabilities.sync().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
});
