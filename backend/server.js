require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bcet_study_materials',
        resource_type: 'auto', // Allows PDFs and other raw files
        allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'png']
    }
});
const upload = multer({ storage: storage });

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const MaterialSchema = new mongoose.Schema({
    department: String,
    semester: String,
    subject: String,
    title: String,
    link: String // This will now store the Cloudinary URL
});
const Material = mongoose.model('Material', MaterialSchema);

// 4. API Routes
// CREATE: Add new material with PDF upload
app.post('/api/materials', upload.single('file'), async (req, res) => {
    try {
        const materialData = {
            department: req.body.department,
            semester: req.body.semester,
            subject: req.body.subject,
            title: req.body.title,
            link: req.file ? req.file.path : '' // req.file.path holds the Cloudinary URL
        };
        const newMaterial = new Material(materialData);
        await newMaterial.save();
        res.status(201).json(newMaterial);
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Failed to save material" });
    }
});

// READ: Get all materials
app.get('/api/materials', async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch materials" });
    }
});

// UPDATE: Modify an existing material
app.put('/api/materials/:id', upload.single('file'), async (req, res) => {
    try {
        const updateData = {
            department: req.body.department,
            semester: req.body.semester,
            subject: req.body.subject,
            title: req.body.title,
        };
        if (req.file) {
            updateData.link = req.file.path; // Update with new Cloudinary URL if a new file is uploaded
        }
        const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedMaterial);
    } catch (error) {
        res.status(500).json({ error: "Failed to update material" });
    }
});

// DELETE: Remove a material
app.delete('/api/materials/:id', async (req, res) => {
    try {
        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete material" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));