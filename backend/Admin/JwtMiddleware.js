const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, 
      process.env.secrete
    ); // Verify token using the same secret key
    req.user = decoded.user; // Attach user info to the request object
    // Check if the user is an admin
    console.log(req.user)
    if (req.user.position !== "Admin") {
      return res.status(403).send("Access denied. Admins only.");
    }

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = adminMiddleware;
