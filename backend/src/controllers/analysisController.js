import { performAIAnalysis } from '../services/aiService.js';
import { verifyCompanyIdentity } from '../services/companyVerifier.js';
import { storageService } from '../services/storageService.js';

export const analysisController = {
  /**
   * POST /api/analyze
   * Analyzes submitted recruitment content, verifies company identity,
   * generates explainable risk metrics, and saves to database.
   */
  async analyze(req, res, next) {
    try {
      const {
        submittedText,
        inputType = 'job_posting',
        companyName = '',
        companyWebsite = '',
        recruiterContact = ''
      } = req.body;

      // 1. Verify company identity
      const compVerify = verifyCompanyIdentity({
        companyName,
        companyWebsite,
        recruiterContact
      });

      // 2. Perform AI / Rule-Engine security analysis
      const analysisOutput = await performAIAnalysis({
        submittedText,
        inputType,
        companyName,
        companyWebsite,
        recruiterContact
      });

      // 3. Assemble document payload
      const recordPayload = {
        inputType,
        companyName: companyName.trim() || compVerify.officialName || 'Unspecified Company',
        companyWebsite: companyWebsite.trim(),
        recruiterContact: recruiterContact.trim(),
        submittedText,
        riskScore: analysisOutput.riskScore,
        riskCategory: analysisOutput.riskCategory,
        summary: analysisOutput.summary,
        indicators: analysisOutput.indicators,
        positiveSignals: analysisOutput.positiveSignals,
        missingInformation: analysisOutput.missingInformation,
        verificationChecklist: analysisOutput.verificationChecklist,
        companyVerification: {
          isVerified: compVerify.isVerified,
          officialSourceFound: compVerify.officialSourceFound,
          sourceUrl: compVerify.careerPortal || compVerify.canonicalDomain || '',
          verificationNotes: compVerify.verificationNotes,
          flaggedDomainMismatch: compVerify.flaggedDomainMismatch
        },
        sourceLinks: [
          ...(compVerify.sourceLinks || []),
          ...(analysisOutput.sourceLinks || [])
        ],
        analysisProvider: analysisOutput.analysisProvider,
        analysisStatus: analysisOutput.analysisStatus
      };

      // 4. Save to persistent storage
      const savedRecord = await storageService.create(recordPayload);

      return res.status(201).json({
        success: true,
        data: savedRecord,
        meta: {
          provider: analysisOutput.analysisProvider,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/analyses
   * Returns paginated analysis history with search & filter capabilities
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        riskCategory,
        inputType,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
      const skip = (pageNum - 1) * limitNum;

      const query = {};
      if (riskCategory && riskCategory !== 'All') {
        query.riskCategory = riskCategory;
      }
      if (inputType && inputType !== 'All') {
        query.inputType = inputType;
      }
      if (search && search.trim() !== '') {
        query.search = search.trim();
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [items, total] = await Promise.all([
        storageService.find({ query, sort, skip, limit: limitNum }),
        storageService.countDocuments(query)
      ]);

      return res.status(200).json({
        success: true,
        data: items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/analyses/:id
   * Returns a single saved analysis report by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const record = await storageService.findById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `No analysis record found with identifier "${id}".`
        });
      }

      return res.status(200).json({
        success: true,
        data: record
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/analyses/:id
   * Removes a saved record by ID
   */
  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await storageService.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `No record found with ID "${id}" to delete.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Analysis record deleted successfully.',
        deletedId: id
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/stats
   * Aggregated dashboard metrics for risk breakdown and recent scans
   */
  async getStats(req, res, next) {
    try {
      const stats = await storageService.getDashboardStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
};
