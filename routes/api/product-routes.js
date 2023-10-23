const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'No product found with that id' });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      const productTags = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTags);
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT (update) a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    let productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

    // Get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    // Create new tags
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    // Tags to be removed
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // Execute both actions
    await ProductTag.destroy({ where: { id: productTagsToRemove } });
    await ProductTag.bulkCreate(newProductTags);

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      res.status(404).json({ message: 'No product found with that id' });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
