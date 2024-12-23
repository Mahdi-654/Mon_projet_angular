const config = require ("config");
const jwt = require ("jsonwebtoken");


const auth = (req, res, next) => {
const token = req. header ("x-auth-token");

if (!token)
return res.status ("401") .json({ msg: "Access denied, please login" });

try {
const decoded = jwt.verify(token, config.get("jwtsecret"));
req.userid = decoded. id;
next ();
} catch (error) {

    return res
.status ("400")
.ison({ msg: "Token not valid, please login again" });
}

};

module. exports = auth;