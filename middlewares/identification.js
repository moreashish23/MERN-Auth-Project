const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
  let token;

  //  Check Authorization header
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  //  OR check cookies (optional)
  if (!token && req.cookies?.Authorization) {
    token = req.cookies.Authorization;
  }

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
