import express from 'express';
import { router as musica } from './routes/musica.js';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

// Cargar variables de entorno
dotenv.config();

// Conexión a MongoDB
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOSTNAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Intentar conectar a la base de datos una vez al inicio
const connect = async () => {
    try {
        await client.connect();
        console.log("Conexión exitosa a la base de datos");
        return client.db(process.env.DBNAME);
    } catch (error) {
        console.error("Error al conectar con la base de datos", error);
        process.exit(1); // Termina el proceso si no puede conectar
    }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, 
    abortOnLimit: true
}));
app.use('/', musica);

// Rutas principales
app.get('/', (req, res) => {
    res.send('Hola desde la API de MUSICA');
});

// Ruta para subir archivos
app.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    try {
        const database = await connect();
        const file = req.files.archivo;
        const bucket = new GridFSBucket(database, { bucketName: 'bucket' });

        const uploadStream = bucket.openUploadStream(file.name, {
            chunkSizeBytes: 1024 * 1024, // 1MB por chunk
            metadata: { contentType: file.mimetype }
        });

        uploadStream.end(file.data);

        uploadStream.on('finish', () => {
            res.send(`File uploaded with id ${uploadStream.id}`);
        });

        uploadStream.on('error', (err) => {
            res.status(500).send('Error uploading file');
        });
    } catch (err) {
        res.status(500).send('Error processing the upload');
    }
});

// Ruta para descargar archivos
app.get('/download/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const database = await connect();
        const bucket = new GridFSBucket(database, { bucketName: 'bucket' });

        const cursor = bucket.find({ _id: id });
        const file = await cursor.next();

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.setHeader('Content-Type', file.metadata.contentType);

        const downloadStream = bucket.openDownloadStream(id);
        downloadStream.pipe(res);
    } catch (err) {
        res.status(500).send('Error downloading file');
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`El servidor está ejecutándose en el puerto ${PORT}`);
});
