const Job = require("../models/Job");
const User = require("../models/User");
const aiService = require("../utils/aiService");

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from the automatic filter object
    const removeFields = ["select", "sort", "page", "limit", "keyword", "location", "minBudget", "maxBudget"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    let filter = JSON.parse(queryStr);

    // Handle keyword search
    if (req.query.keyword) {
      filter.$or = [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(req.query.keyword, "i")] } },
      ];
    }

    // Handle Budget range
    if (req.query.minBudget || req.query.maxBudget) {
      filter.budget = {};
      if (req.query.minBudget) filter.budget.$gte = Number(req.query.minBudget);
      if (req.query.maxBudget) filter.budget.$lte = Number(req.query.maxBudget);
    }

    // Default status to open
    if (!filter.status) {
      filter.status = "open";
    }

    // Handle location search (filters by employer's location)
    if (req.query.location) {
      const employersInLocation = await User.find({
        role: "employer",
        location: { $regex: req.query.location, $options: "i" },
      }).select("_id");

      const employerIds = employersInLocation.map((emp) => emp._id);
      filter.employer = { $in: employerIds };
    }

    // Finding resource
    query = Job.find(filter).populate("employer", "name email location companyLogo");

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const jobs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name email");

    if (!job) {
      res.status(404);
      throw new Error(`Job not found with id of ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer)
exports.createJob = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.employer = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error(`Job not found with id of ${req.params.id}`);
    }

    // Make sure user is employer
    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(401);
      throw new Error(`User ${req.user.id} is not authorized to update this job`);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error(`Job not found with id of ${req.params.id}`);
    }

    // Make sure user is employer
    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(401);
      throw new Error(`User ${req.user.id} is not authorized to delete this job`);
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get AI Job Recommendations for Freelancer
// @route   GET /api/jobs/recommendations
// @access  Private (Freelancer)
exports.getRecommendations = async (req, res, next) => {
  try {
    // 1. Get current user
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "freelancer") {
      res.status(403);
      throw new Error("Only freelancers can get job recommendations.");
    }

    // 2. If no skills/bio, return empty to trigger frontend "Update Profile" state
    if (!user.skills || user.skills.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // 3. Fetch latest open jobs (Limit to 50 for prompt size)
    const recentJobs = await Job.find({ status: "open" })
      .select("_id title description skillsRequired budget category")
      .sort("-createdAt")
      .limit(50);

    if (recentJobs.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // 4. Generate Match using AIService
    const prompt = `
      You are an expert technical recruiter and AI matchmaker. 
      Analyze the Freelancer's profile and the provided List of Open Jobs.
      Return EXACTLY the IDs of the Top 5 most suitable jobs for this freelancer based on their skills and bio.
      
      Freelancer Profile:
      Name: ${user.name}
      Bio: ${user.bio || "No bio provided."}
      Skills: ${user.skills.join(", ")}
      
      List of Open Jobs (JSON format):
      ${JSON.stringify(recentJobs)}
      
      Return ONLY a valid JSON array of string IDs representing the best matches. Do NOT wrap it in markdown block quotes. Just the raw array like: ["id1", "id2", "id3"]. Return fewer than 5 if there aren't many good matches.
    `;

    const aiResponse = await aiService.generateContent(prompt, "jobMatch");
    
    let matchedIds = [];
    if (typeof aiResponse === "string") {
        try {
            const cleaned = aiService.cleanMarkdown(aiResponse);
            matchedIds = JSON.parse(cleaned);
        } catch (e) {
            console.error("AI Match Parse Error, using local fallback");
            matchedIds = null;
        }
    } else if (Array.isArray(aiResponse)) {
        matchedIds = aiResponse;
    }

    // Ensure matchedIds is an array
    if (!Array.isArray(matchedIds)) {
        // Use local algorithmic fallback if AI fails completely
        const userSkills = (user.skills || []).map(s => s.toLowerCase());
        matchedIds = recentJobs
            .filter(job => {
                const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());
                return jobSkills.some(js => userSkills.includes(js)) || 
                       userSkills.some(us => job.title.toLowerCase().includes(us));
            })
            .slice(0, 5)
            .map(job => job._id.toString());
    }

    // 7. Fetch the full populated jobs from those IDs
    const recommendedJobs = await Job.find({ _id: { $in: matchedIds } })
      .populate("employer", "name companyLogo location email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: recommendedJobs,
    });
  } catch (err) {
      next(err);
  }
};