const VALID_INPUT_TYPES = [
  'job_posting',
  'internship_offer',
  'recruiter_message',
  'email',
  'offer_letter'
];

export function validateAnalysisInput(req, res, next) {
  const { submittedText, inputType, companyName, companyWebsite, recruiterContact } = req.body;

  if (!submittedText || typeof submittedText !== 'string' || submittedText.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Recruitment text content is required. Please paste the job description, message, or offer letter.'
    });
  }

  const trimmed = submittedText.trim();
  if (trimmed.length < 20) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The submitted text is too short to perform a meaningful security analysis. Please provide at least 20 characters.'
    });
  }

  if (trimmed.length > 15000) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The submitted text exceeds the maximum permitted limit of 15,000 characters.'
    });
  }

  if (inputType && !VALID_INPUT_TYPES.includes(inputType)) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: `Invalid inputType: "${inputType}". Allowed types are: ${VALID_INPUT_TYPES.join(', ')}`
    });
  }

  if (companyName && typeof companyName === 'string' && companyName.length > 120) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Company name cannot exceed 120 characters.'
    });
  }

  if (companyWebsite && typeof companyWebsite === 'string' && companyWebsite.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Company website URL cannot exceed 255 characters.'
    });
  }

  if (recruiterContact && typeof recruiterContact === 'string' && recruiterContact.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Recruiter contact details cannot exceed 200 characters.'
    });
  }

  next();
}
