import mongoose from "mongoose";
import dotenv from "dotenv";
//import  MongoClient  from "mongodb";
import pkg from "mongodb";
const { MongoClient } = pkg;

dotenv.config();  // Cargar las variables de entorno

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOSTNAME}/${process.env.DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;


const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1); 
  }
};

const mongoClient = new MongoClient(uri);

connectDB(); // Llamar a la función para establecer la conexión

export { connectDB, mongoClient };