import { verifyCompanyIdentity } from '../services/companyVerifier.js';

export const verificationController = {
  /**
   * POST /api/verify-company
   * Checks company identity against curated directories and flags discrepancies
   */
  async verify(req, res, next) {
    try {
      const { companyName = '', companyWebsite = '', recruiterContact = '' } = req.body;

      if (!companyName && !companyWebsite && !recruiterContact) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Please provide at least a company name, website, or recruiter contact to verify.'
        });
      }

      const result = verifyCompanyIdentity({
        companyName,
        companyWebsite,
        recruiterContact
      });

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};
