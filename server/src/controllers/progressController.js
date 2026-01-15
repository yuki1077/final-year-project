const {
  getEntriesBySchool,
  getEntriesByPublisher,
  createEntry,
  updateEntry,
  deleteEntry,
  getEntryById,
} = require('../services/progressService');

const listEntries = async (req, res, next) => {
  try {
    const entries = await getEntriesBySchool(req.user.id);
    res.json({ data: entries });
  } catch (error) {
    next(error);
  }
};

const addEntry = async (req, res, next) => {
  try {
    const { bookId, bookTitle, status, description } = req.body;
    if (!bookId || !bookTitle) {
      return res.status(400).json({ message: 'Book selection is required' });
    }

    const entry = await createEntry({
      schoolId: req.user.id,
      schoolName: req.user.email,
      bookId,
      bookTitle,
      status: status || 'in-progress',
      description,
    });

    res.status(201).json({ data: entry });
  } catch (error) {
    next(error);
  }
};

const editEntry = async (req, res, next) => {
  try {
    const entry = await getEntryById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    if (entry.schoolId !== String(req.user.id)) {
      return res.status(403).json({ message: 'You are not allowed to modify this entry' });
    }

    const updated = await updateEntry(req.params.id, {
      status: req.body.status,
      description: req.body.description,
    });

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

const removeEntry = async (req, res, next) => {
  try {
    const entry = await getEntryById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    if (entry.schoolId !== String(req.user.id)) {
      return res.status(403).json({ message: 'You are not allowed to delete this entry' });
    }

    await deleteEntry(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const listEntriesByPublisher = async (req, res, next) => {
  try {
    const entries = await getEntriesByPublisher(req.user.id);
    res.json({ data: entries });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listEntries,
  listEntriesByPublisher,
  addEntry,
  editEntry,
  removeEntry,
};

