const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json({ message: 'Successfully retrieved all tags', data: tags });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching tags', error: err });
  }
});

// GET a single tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tag) {
      res.status(404).json({ message: 'No tag found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Successfully retrieved tag', data: tag });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching the tag', error: err });
  }
});

// POST a new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({ message: 'Tag successfully created', data: tag });
  } catch (err) {
    res.status(400).json({ message: 'An error occurred while creating the tag', error: err });
  }
});

// PUT (update) a tag
router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!tag[0]) {
      res.status(404).json({ message: 'No tag found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'An error occurred while updating the tag', error: err });
  }
});

// DELETE a tag
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tag) {
      res.status(404).json({ message: 'No tag found with the specified ID' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the tag', error: err });
  }
});

module.exports = router;
