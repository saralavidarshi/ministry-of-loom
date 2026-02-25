require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));


const healthRoutes = require("./routes/health.routes");
const testRoutes = require("./routes/test.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes=require("./routes/admin.routes");
const productsRoutes=require("./routes/products.routes");
const adminProductsRoutes=require("./routes/admin.products.routes");

app.use(healthRoutes);
app.use(testRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(productsRoutes);
app.use(adminProductsRoutes);

app.listen(process.env.PORT || 4000, () => console.log("API running"));
