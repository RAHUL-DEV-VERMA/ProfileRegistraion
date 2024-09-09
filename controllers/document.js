import imageModel from "../models/image.js";
import userModel from "../models/user.js";

// Serve the document upload page
const documentPage = async (req, res) => {
    try {
      // Fetch user and populate documents for the selected profile
      const user = await userModel
        .findOne({ emailId: req.session.passport.user })
        .populate('profiles.documents'); // Populates documents from imageModel
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const selectedProfileId = req.session.selectedProfile;
      const selectedProfile = user.profiles.id(selectedProfileId);
  
      if (!selectedProfile) {
        return res.status(404).send("Profile not found");
      }
  
      // Render the document.ejs page with selectedProfile data
      res.render("document", { selectedProfile });
    } catch (error) {
      console.error("Error displaying documents:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  

// Handle document upload
const uploadDocument = async (req, res) => {
  try {
    // File size and type validation
    const fileSize = req.file.size;
    const fileType = req.file.mimetype;

    // Size limit: 25 KB to 5 MB
    if (fileSize < 25 * 1024 || fileSize > 5 * 1024 * 1024) {
      return res.status(400).send("File size must be between 25KB and 5MB");
    }

    // Allowed file types
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(fileType)) {
      return res
        .status(400)
        .send("Invalid file type. Only PNG, JPEG, JPG, and PDF are allowed.");
    }

    // Find user and selected profile
    const user = await userModel.findOne({
      emailId: req.session.passport.user,
    });
    const selectedProfileId = req.session.selectedProfile;
    const profile = user.profiles.id(selectedProfileId);

    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    // Initialize the documents array if it's undefined
    if (!profile.documents) {
      profile.documents = [];
    }

    // Create and save document entry in the database
    const document = await imageModel.create({
      image: req.file.filename,
      imageNote: req.body.filecaption,
      user: user._id,
    });

    // Add document to the profile's list of documents
    profile.documents.push(document._id);

    // Save the updated user
    await user.save();

    res.redirect("/api/v1/document");
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { documentPage, uploadDocument };
