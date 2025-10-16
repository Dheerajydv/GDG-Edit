import express from 'express';
import Team from '../models/Team.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/teams
// @desc    Create a new team
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { eventId, teamName, maxMembers } = req.body;

    // Check if team name already exists for this event
    const existingTeam = await Team.findOne({
      event: eventId,
      teamName,
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team name already exists for this event',
      });
    }

    // Create team
    const team = await Team.create({
      event: eventId,
      teamName,
      teamLeader: req.user._id,
      members: [req.user._id],
      maxMembers: maxMembers || 4,
    });

    await team.populate('teamLeader members', 'name email profilePhoto');

    res.status(201).json({
      success: true,
      team,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/teams/event/:eventId
// @desc    Get all teams for an event
// @access  Public
router.get('/event/:eventId', async (req, res, next) => {
  try {
    const teams = await Team.find({ event: req.params.eventId })
      .populate('teamLeader members', 'name email profilePhoto')
      .sort({ score: -1, createdAt: -1 });

    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/teams/:id/join
// @desc    Join a team
// @access  Private
router.post('/:id/join', protect, async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Team is full',
      });
    }

    // Check if user already in team
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team',
      });
    }

    // Add user to team
    team.members.push(req.user._id);
    await team.save();

    await team.populate('teamLeader members', 'name email profilePhoto');

    res.json({
      success: true,
      message: 'Successfully joined team',
      team,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/teams/:id/submit
// @desc    Submit project
// @access  Private (Team Leader only)
router.post('/:id/submit', protect, async (req, res, next) => {
  try {
    const { projectTitle, projectDescription, githubUrl, demoVideoUrl } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check if user is team leader
    if (team.teamLeader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can submit project',
      });
    }

    team.projectTitle = projectTitle;
    team.projectDescription = projectDescription;
    team.githubUrl = githubUrl;
    team.demoVideoUrl = demoVideoUrl;
    team.submissionTime = Date.now();

    await team.save();

    res.json({
      success: true,
      message: 'Project submitted successfully',
      team,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/teams/:id/leaderboard
// @desc    Get leaderboard for event
// @access  Public
router.get('/leaderboard/:eventId', async (req, res, next) => {
  try {
    const teams = await Team.find({ event: req.params.eventId })
      .populate('teamLeader members', 'name email profilePhoto')
      .sort({ score: -1, submissionTime: 1 })
      .select('-__v');

    // Add rank
    teams.forEach((team, index) => {
      team.rank = index + 1;
    });

    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
