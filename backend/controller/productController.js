const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            name,
            description,
            price,
            category,
            stock
        } = req.body;

        let imageUrl = '';

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log("Cloudinary Upload Success:", result.secure_url);
            imageUrl = result.secure_url;
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            images: imageUrl ? [imageUrl] : []
        });

        const createdProduct = await product.save();

        res.status(201).json(createdProduct);

    } catch (error) {

        console.error("CREATE PRODUCT ERROR:");
        console.error(error);

        res.status(500).json({
            message: error.message,
            error: error.toString()
        });
    }
};

const updateProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        let imageUrl = product.images?.[0] || '';

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.stock = req.body.stock || product.stock;
        product.images = imageUrl ? [imageUrl] : product.images;

        const updatedProduct = await product.save();

        res.json(updatedProduct);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        res.json({
            message: 'Product removed successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};