import BookClub from "../models/Bookclub.js";
import User from "../models/User.js";

// @desc    Create a new book club
// @route   POST /api/bookclubs
// @access  Private
export const createBookClub = async (req, res) => {
  try {
    const { name, description, privacy, avatar } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ status: false, message: "Club name is required" });
    }

    if (!privacy || !["public", "private"].includes(privacy)) {
      return res.status(400).json({ status: false, message: "Privacy must be either 'public' or 'private'" });
    }

    // Create the club
    const newClub = await BookClub.create({
      name,
      description: description || "",
      avatar: avatar || "",
      privacy,
      admin: userId,
      members: [userId],
    });

    res.status(201).json({
      status: true,
      data: newClub,
      message: "Club created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

// @desc    Get book club by ID
// @route   GET /api/bookclubs/:id
// @access  Private
export const getBookClubById = async (req, res) => {
  try {
    const clubId = req.params.id;

    const club = await BookClub.findById(clubId)
      .populate("admin", "name username avatar")
      .populate("members", "name username avatar")
      .populate("invitedMembers", "name username avatar")
      .populate("posts.user", "name username avatar");
    await club.populate("admin members invitedMembers");


    if (!club) {
      return res.status(404).json({ status: false, message: "Book club not found" });
    }

    res.status(200).json({
      status: true,
      data: club,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};


export const addMemberToClub = async (req, res) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;

    const club = await BookClub.findById(clubId);
    if (!club) return res.status(404).json({ status: false, message: "Club not found" });

    if (club.members.includes(userId)) {
      return res.status(400).json({ status: false, message: "User already a member" });
    }

    club.members.push(userId);
    await club.save();

    res.status(200).json({ status: true, message: "Member added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};


// GET /api/bookclub/my-clubs
export const getMyBookClubs = async (req, res) => {
  try {
    const userId = req.user._id;

    const clubs = await BookClub.find({
      members: userId,
    }).select("name avatar members");

    const formattedClubs = clubs.map((club) => ({
      _id: club._id,
      name: club.name,
      avatar: club.avatar,
      memberCount: club.members.length,
    }));

    res.json({
      status: true,
      data: formattedClubs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch user book clubs",
    });
  }
};

// GET /api/bookclub/all
export const getAllBookClubs = async (req, res) => {
  try {
    const userId = req.user._id;

    const clubs = await BookClub.find()
      .select("name avatar privacy members invitedMembers");

    const formatted = clubs.map((club) => {
      const isMember = club.members.includes(userId);
      const isInvited = club.invitedMembers.includes(userId);

      return {
        _id: club._id,
        name: club.name,
        avatar: club.avatar,
        privacy: club.privacy,
        memberCount: club.members.length,
        isMember,
        isInvited,
      };
    });

    res.json({ status: true, data: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Failed to fetch clubs" });
  }
};
// POST /api/bookclub/:id/join
export const joinPublicClub = async (req, res) => {
  try {
    const userId = req.user._id;
    const club = await BookClub.findById(req.params.id);

    if (!club) return res.status(404).json({ message: "Club not found" });
    if (club.privacy !== "public")
      return res.status(403).json({ message: "Private club" });

    if (club.members.includes(userId))
      return res.status(400).json({ message: "Already a member" });

    club.members.push(userId);
    await club.save();

    res.json({ status: true });
  } catch (err) {
    res.status(500).json({ message: "Join failed" });
  }
};
// POST /api/bookclub/:id/request
export const requestToJoinClub = async (req, res) => {
  try {
    const userId = req.user._id;
    const club = await BookClub.findById(req.params.id);

    if (!club) return res.status(404).json({ message: "Club not found" });
    if (club.privacy !== "private")
      return res.status(400).json({ message: "Not a private club" });

    if (
      club.members.includes(userId) ||
      club.invitedMembers.includes(userId)
    ) {
      return res.status(400).json({ message: "Already requested or member" });
    }

    club.invitedMembers.push(userId);
    await club.save();

    res.json({ status: true });
  } catch (err) {
    res.status(500).json({ message: "Request failed" });
  }
};

export const acceptJoinRequest = async (req, res) => {
  const { id, userId } = req.params;

  const club = await BookClub.findById(id);
  if (!club) return res.status(404).json({ message: "Club not found" });

  club.invitedMembers = club.invitedMembers.filter(
    (u) => u.toString() !== userId
  );
  club.members.push(userId);

  await club.save();
  res.json({ success: true });
};

/* DENY REQUEST */
export const denyJoinRequest = async (req, res) => {
  const { id, userId } = req.params;

  const club = await BookClub.findById(id);
  if (!club) return res.status(404).json({ message: "Club not found" });

  club.invitedMembers = club.invitedMembers.filter(
    (u) => u.toString() !== userId
  );

  await club.save();
  res.json({ success: true });
};

