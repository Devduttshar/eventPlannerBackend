const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    console.log('req.body',req.body);
    console.log('req.header',req.header("Authorization"));

    const token =
      req.header("Authorization").replace("Bearer ", "") || req.body.token ||
      req.cookies["token"];
      console.log('req.header',req.header("Authorization"))
    
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }
    
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log('decode',decode);
      req.user = decode;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }
    next();
  } catch (error) {
    console.log('error',error);
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admin only." });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ success: false, message: "Not Authorized" });
  }
  next();
};

module.exports = { auth, isAdmin, isUser };


