const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    res.status(200).json({ message: 'Successfully retrieved all products', data: products });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching products', error: err });
  }
});

// GET a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'No product found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Successfully retrieved product', data: product });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching the product', error: err });
  }
});

// POST a new product
// router.post('/', async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
    
//     if (req.body.tagIds.length) {
//       const productTagIdArr = req.body.tagIds.map((tag_id) => {
//         return {
//           product_id: product.id,
//           tag_id,
//         };
//       });
//       const productTags = await ProductTag.bulkCreate(productTagIdArr);
//       res.status(200).json({ message: 'Product and tags successfully created', data: productTags });
//     } else {
//       res.status(200).json({ message: 'Product successfully created', data: product });
//     }
//   } catch (err) {
//     res.status(400).json({ message: 'An error occurred while creating the product', error: err });
//   }
// });

// POST a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({ message: 'Product successfully created', data: product });
  } catch (err) {
    res.status(400).json({ message: 'An error occurred while creating the product', error: err });
  }
});

// PUT (update) a product
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    let productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
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

    // Remove old tags
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    await ProductTag.destroy({ where: { id: productTagsToRemove } });
    await ProductTag.bulkCreate(newProductTags);

    res.status(200).json({ message: 'Product updated successfully, including associated tags' });
  } catch (err) {
    res.status(400).json({ message: 'An error occurred while updating the product', error: err });
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
      res.status(404).json({ message: 'No product found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Product successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the product', error: err });
  }
});

module.exports = router;
