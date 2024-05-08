const Logos = require('../models/LogosModel');
const multer = require('multer');
const path = require('path');

const getAllLogos = async (req, res) => {
    try {
        const logos = await Logos.find();
        res.json(logos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/logos'); // Destination folder for storing logo images
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Filename generation
    }
});

// Multer file filter for PNG images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only PNG images are allowed'), false);
    }
};

// Multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limiting file size to 10MB
}).fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }, { name: 'horizontalLogo', maxCount: 1 }]);

const createLogo = async (req, res) => {
    try {
        console.log('Request Files:', req.files); // Log req.files for debugging

        // Check if req.files is populated
        if (!req.files || !req.files['logo'] || !req.files['favicon'] || !req.files['horizontalLogo']) {
            return res.status(400).json({ message: 'No files uploaded or invalid field names' });
        }

        const logoPath = req.files['logo'][0].path;
        const faviconPath = req.files['favicon'][0].path;
        const horizontalLogoPath = req.files['horizontalLogo'][0].path; // New field

        // Creating new logo document
        const newLogo = new Logos({ logo: logoPath, favicon: faviconPath, horizontalLogo: horizontalLogoPath });
        await newLogo.save();
        res.status(201).json(newLogo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const updateLogoById = async (req, res) => {
    try {
        console.log('Request Files:', req.files); // Log req.files for debugging

        const { logo, favicon, horizontalLogo } = req.files || {};

        // Check if any of the fields are undefined
        if (!logo && !favicon && !horizontalLogo) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Extract file paths if the fields are present
        const logoPath = logo ? logo[0]?.path : undefined;
        const faviconPath = favicon ? favicon[0]?.path : undefined;
        const horizontalLogoPath = horizontalLogo ? horizontalLogo[0]?.path : undefined;

        // Updating the logo document
        const updatedFields = {};
        if (logoPath) updatedFields.logo = logoPath;
        if (faviconPath) updatedFields.favicon = faviconPath;
        if (horizontalLogoPath) updatedFields.horizontalLogo = horizontalLogoPath;

        const updatedLogo = await Logos.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        if (updatedLogo) {
            res.json(updatedLogo);
        } else {
            res.status(404).json({ message: 'Logo not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createLogo,
    updateLogoById,
    upload, // Exporting upload middleware for use in routes
    getAllLogos
};
