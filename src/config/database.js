import mongoose from "mongoose";

export const conectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/tpmongoose`);
    // await mongoose.connection.dropDatabase();
    console.log("Base de datos conectada correctamente.");
  } catch (error) {
    console.log("No se pudo conectar a la base de datos", error);
  }
};