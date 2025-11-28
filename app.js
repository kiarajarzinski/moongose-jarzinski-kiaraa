import express from "express";
import "dotenv/config";
import { conectDB } from "./src/config/database.js";
import { userRoute } from "./src/routes/user.routes.js";
import { tagRoute } from "./src/routes/tag.routes.js";
import { profileRoute } from "./src/routes/profile.routes.js";
import { postRoute } from "./src/routes/post.routes.js";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use("/api", userRoute);
app.use("/api", tagRoute);
app.use("/api", profileRoute);
app.use("/api", postRoute);

app.listen(PORT, async () => {
    await conectDB();
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});