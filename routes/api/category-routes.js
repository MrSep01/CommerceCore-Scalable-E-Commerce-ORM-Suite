const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Find all categories, including associated products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [Product],
    });
    res.status(200).json({ message: 'Successfully retrieved all categories', data: categories });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching categories', error: err });
  }
});

// Find one category by its `id` value, including associated products
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [Product],
    });

    if (!category) {
      res.status(404).json({ message: 'No category found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Successfully retrieved category', data: category });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching the category', error: err });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({ message: 'Category successfully created', data: newCategory });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while creating the category', error: err });
  }
});

// Update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedCategory) {
      res.status(404).json({ message: 'No category found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while updating the category', error: err });
  }
});

// Delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    // Delete associated products first
    await Product.destroy({
      where: {
        category_id: req.params.id,
      },
    });

    // Now delete the category
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedCategory) {
      res.status(404).json({ message: 'No category found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Category and associated products deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the category', error: err });
  }
});

module.exports = router;
