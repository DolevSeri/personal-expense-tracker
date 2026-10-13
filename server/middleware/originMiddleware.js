const checkOrigin = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");
  const allowedOrigin = process.env.CLIENT_URL;
  if (!origin || origin !== allowedOrigin) {
    return res.status(403).json({
      message: "Forbidden origin",
    });
  }

  next();
};

module.exports = checkOrigin;
