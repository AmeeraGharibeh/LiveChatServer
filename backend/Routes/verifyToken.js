const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const AuthModel = require("../Models/AuthModel");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWTSECRET, (err, user) => {
        if (err) {
          return res
            .status(401)
            .send({ msg: "Session is not valid or expired" });
        }
        req.body = user;
        next();
      });
    } else {
      return res.status(401).send({ msg: "Unauthorized access" });
    }
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const verifyTokenAndAdmin = async (req, res, next) => {
  body = req.body;
  try {
    await verifyToken(req, res, async () => {
      console.log("verify token " + JSON.stringify(req.body, null, 2));
      const types = ["admin", "super_admin", "master", "root"];
      const adminUser = await UserModel.findById(req.body.id);
      const dashboardUser = await AuthModel.findById(req.body.id);

      let master;

      if (adminUser && types.includes(adminUser.user_type)) {
        master = adminUser.username;
        console.log("admin");
      } else if (dashboardUser && dashboardUser.is_dashboard_admin) {
        master = "dashboard";
        console.log("dashboard");
      } else {
        return res.status(403).send({ msg: "Permission denied" });
      }

      req.body = { master, body };
      next();
    });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  body = req.body;
  let master;
  try {
    verifyToken(req, res, async () => {
      console.log(req.body);
      const currentUser = await AuthModel.findById(req.body.id);
      if (currentUser.is_dashboard_admin) {
        master = currentUser.username;
        req.body = { master, body };
        console.log(req.body);
        next();
      } else {
        return res.status(403).json({
          msg: "عذراً, يُسمح فقط لمدراء لوحة التحكم القيام بهذا الإجراء",
        });
      }
    });
  } catch (err) {
    return res.status(500).send({ msg: "we have some glitches!" });
  }
};

const verifyTokenAndAction = (req, res, next) => {
  body = req.body;
  action = req.body.action;
  console.log("verify" + JSON.stringify(body));
  try {
    verifyToken(req, res, async () => {
      const currentUser = await UserModel.findById(req.body.id);
      if (currentUser.permissions[action] === true) {
        const master = currentUser.username;
        req.body = { master, body };
        next();
      } else {
        return res
          .status(403)
          .send({ msg: "عذراً, لا تملك الصلاحية للقيام هذا الإجراء" });
      }
    });
  } catch (err) {
    return res.status(500).send({ msg: "we have some glitches!" });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAction,
  verifyTokenAndAdmin,
};
