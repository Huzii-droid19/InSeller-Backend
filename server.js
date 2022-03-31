const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const Pusher = require("pusher");

dotenv.config();
const PORT = process.env.PORT || 5000;
const corsOptions = { credentials: true, origin: process.env.url || "*" };
const app = express();

//express middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const pusher = new Pusher({
  app_id: "1340392",
  key: "22e26683e4241e92b80e",
  secret: "536db42ffd8ba0295af1",
  cluster: "mt1",
  useTLS: true,
});

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

app.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));
