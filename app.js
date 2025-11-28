import express from "express";
import "dotenv/config";
import { conectDB } from "./src/config/database.js";
import { userRoute } from "./src/routes/user.routes.js";
import { routerTag } from "./src/routes/tag.routes.js";
import { routeProfile } from "./src/routes/profile.routes.js";
import { routePost } from "./src/routes/post.routes.js";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use("/api", userRoute);
app.use("/api", routerTag);
app.use("/api", routeProfile);
app.use("/api", routePost);

app.listen(PORT, async () => {
    await conectDB();
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});