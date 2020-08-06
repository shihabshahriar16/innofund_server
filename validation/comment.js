const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateCommentInput(data) {
  let errors = {};
  data.comment_text = !isEmpty(data.comment_text) ? data.comment_text : '';

  if (Validator.isEmpty(data.comment_text)) {
    errors.comment_text = 'Please enter a comment';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
