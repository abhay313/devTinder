const adminAuth = (req, res, next) => {
  console.log("Admin authorization is getting checked");

  const token = "xyz";
  const isAdminAuthorized = token === "xysz";
  if (!isAdminAuthorized) {
    res.status(400).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
