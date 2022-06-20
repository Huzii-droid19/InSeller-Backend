const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

dotenv.config();
const PORT = process.env.PORT || 5000;
const corsOptions = { credentials: true, origin: process.env.url || "*" };
const app = express();

//express middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", express.static("public"));
app.use("/api/user/store", require("./routes/seller.routes"));
app.use("/api/admin/store-category", require("./routes/store-category.routes"));
app.use("/api/user/store/item", require("./routes/item.routes"));
app.use(
  "/api/user/store/item/category",
  require("./routes/item-category.routes")
);
app.use("/api/user/store/orders/", require("./routes/order.routes"));

app.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));
