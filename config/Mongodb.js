import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Cargar las variables de entorno

const connectDB = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBHOST}/${process.env.DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1); // Detener la aplicación si no se puede conectar
  }
};

connectDB(); // Llamar a la función para establecer la conexión

export {connectDB}