import User from "../../models/user";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import bcrypt from "bcryptjs";

export default withSession(async (req, res) => {
  try {
    await dbConnect();
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        error: {
          field: "email",
          message: "User with provided email does not exist",
        },
      });
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.json({
        error: { field: "password", message: "The password is incorrect" },
      });
    }
    req.session.set("userId", user._id);
    await req.session.save();

    const { _doc } = user;
    const { password, ...userInfo } = _doc;
    res.status(200).json({ isLoggedIn: true, userInfo });
  } catch (error) {
    res
      .status(500)
      .json({ error: { field: "server", message: error.message } });
  }
});
