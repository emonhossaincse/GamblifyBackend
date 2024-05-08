const Faq = require('../models/FaqModel');

// Controller function to create a new FAQ
const createFaq = async (req, res) => {
    try {
        const { faqQuestion, faqAnswer, status } = req.body;
        const faq = new Faq({ faqQuestion, faqAnswer, status });
        await faq.save();
        res.status(201).json(faq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get all FAQs
const getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get a single FAQ by ID
const getFaqById = async (req, res) => {
    try {
        const faq = await Faq.findById(req.params.id);
        if (faq) {
            res.json(faq);
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update a FAQ by ID
const updateFaqById = async (req, res) => {
    try {
        const { faqQuestion, faqAnswer, status } = req.body;
        const faq = await Faq.findByIdAndUpdate(req.params.id, { faqQuestion, faqAnswer, status }, { new: true });
        if (faq) {
            res.json(faq);
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete a FAQ by ID
const deleteFaqById = async (req, res) => {
    try {
        const faq = await Faq.findByIdAndDelete(req.params.id);
        if (faq) {
            res.json({ message: 'FAQ deleted successfully' });
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFaq,
    getAllFaqs,
    getFaqById,
    updateFaqById,
    deleteFaqById
};
