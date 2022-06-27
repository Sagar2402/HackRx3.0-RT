const { Insurance, User } = require("../models");
const Claim = require("../models/claim.model");

const createClaim = async (req, res) => {
  try {
    let { insurance, title, description } = req.body;
    let user = req.user.id;
    const insuranceExists = await User.exists({
      _id: user,
      insurance: insurance,
    });
    if (!insuranceExists) {
      return res.json({ success: false, message: "Insurance Not Purchased" });
    }
    const claimId = (Math.random() + 1).toString(36).substring(7);
    let ins = await Insurance.findById(insurance);
    const claimsCount = await Claim.count({
      insurance,
      user,
      isValid: true,
    });
    if (ins.maxClaims == claimsCount) {
      return res.json({ success: false, message: "Max Claims Reached" });
    }

    const number = claimsCount + 1;
    const claim = new Claim({
      claimId: claimId,
      title,
      description,
      user,
      insurance,
      number,
      employee: [],
      isValid: null,
      status: "Raised",
    });
    await claim.save();
    return res.json({ success: true, message: "Claim Raised", data: claim });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

const addAttachment = async (req, res) => {
  try {
    const claim_files = [];
    const { claim_id } = req.query;
    const files = req.files;
    for (let i = 0; i < files.length; i++) {
      const randomID = Math.random();
      const item = files[i];
      regex = new RegExp("[^.]+$");
      extension = item.originalname.match(regex);
      const newFile = new File({
        fileName: item.originalname,
        url:
          "https://" +
          process.env.BUCKET +
          ".s3.amazonaws.com/claims/" +
          claim_id +
          "/" +
          randomID +
          item.originalname,
        type: extension[0],
        key: "claims/" + claim_id + "/" + randomID + item.originalname,
      });
      doUpload(newFile.key, item);
      claim_files.push(newFile);
    }
    const claim = await Claim.findOneAndUpdate(
      { _id: claim_id },
      {
        $push: {
          files: {
            $each: claim_files,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: {
        claim: claim,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const listClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id })
      .populate("insurance")
      .sort({
        createdAt: 1,
      });
    return res.json({
      success: true,
      message: "List of raised claims",
      data: claims,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = { createClaim, addAttachment, listClaims };
