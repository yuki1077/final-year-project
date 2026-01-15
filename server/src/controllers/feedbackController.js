const {
  createFeedback,
  getFeedbackForPublisher,
  getFeedbackForSchool,
  getAllFeedback,
} = require('../services/feedbackService');

const addFeedback = async (req, res, next) => {
  try {
    const { publisherId, publisherName, message } = req.body;
    if (!publisherId || !publisherName || !message) {
      return res.status(400).json({ message: 'Publisher and message are required' });
    }

    const feedback = await createFeedback({
      schoolId: req.user.id,
      schoolName: req.user.email,
      publisherId,
      publisherName,
      message,
    });

    res.status(201).json({ data: feedback });
  } catch (error) {
    next(error);
  }
};

const listFeedback = async (req, res, next) => {
  try {
    let feedback;
    if (req.user.role === 'publisher') {
      feedback = await getFeedbackForPublisher(req.user.id);
    } else if (req.user.role === 'school') {
      feedback = await getFeedbackForSchool(req.user.id);
    } else {
      feedback = await getAllFeedback();
    }

    res.json({ data: feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFeedback,
  listFeedback,
};

