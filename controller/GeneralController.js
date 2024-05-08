const General = require('../models/GeneralModel');

// Controller to view general settings
exports.viewGeneralSettings = async (req, res, next) => {
    try {
        const generalSettings = await General.findOne();
        if (!generalSettings) {
            return res.status(404).json({ success: false, message: 'General settings not found' });
        }
        res.status(200).json({ success: true, data: generalSettings });
    } catch (error) {
        next(error);
    }
};

// Controller to create general settings
exports.createGeneralSettings = async (req, res, next) => {
    try {
        const { siteTitle, currency, currencySymbol, defaultLanguage } = req.body;
        const generalSettings = await General.create({ siteTitle, currency, currencySymbol, defaultLanguage });
        res.status(201).json({ success: true, data: generalSettings });
    } catch (error) {
        next(error);
    }
};

// Controller to update general settings
exports.updateGeneralSettings = async (req, res, next) => {
    try {
        const { siteTitle, currency, currencySymbol, defaultLanguage } = req.body;
        const updatedGeneralSettings = await General.findOneAndUpdate({}, { siteTitle, currency, currencySymbol, defaultLanguage }, { new: true });
        if (!updatedGeneralSettings) {
            return res.status(404).json({ success: false, message: 'General settings not found' });
        }
        res.status(200).json({ success: true, data: updatedGeneralSettings });
    } catch (error) {
        next(error);
    }
};

exports.viewGeneralSettingsById = async (req, res, next) => {
    const { id } = req.params; // Extract the ID from request parameters
    try {
        const generalSettings = await General.findById(id);
        if (!generalSettings) {
            return res.status(404).json({ success: false, message: 'General settings not found' });
        }
        res.status(200).json({ success: true, data: generalSettings });
    } catch (error) {
        next(error);
    }
};
