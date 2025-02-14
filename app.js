const express = require("express");

const app = express();
app.use(express.json());

app.use("/categories", require("./routes/catagories_routes"));
app.use("/products", require("./routes/products_routes"));

app.listen(3001, () => console.log("Server running on port 3001"));
