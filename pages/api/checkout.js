import withSession from "../../middleware/session";
import User from "../../models/user";
import { dbConnect } from "../../middleware/db";
import fetch from "../../utils/nodeFetchJson";
import { HANSEN_CUSTOMER_REF } from "../../utils/constants";

export default withSession(async (req, res) => {
  try {
    await dbConnect();

    const userId = req.session.get("userId");
    if (!userId) {
      return res.status(401).json({
        error: {
          field: "user",
          message: "Please log in to submit any orders.",
        },
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({
        error: {
          field: "user",
          message: "User does not exist in the system.",
        },
      });
    }

    const { quoteId, quoteLastUpdated, activationDate } = req.body;

    const result = await fetch(
      `${process.env.HANSEN_CPQ_V2_BASE_URL}/quotes/${quoteId}/convertToOrder`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteLastUpdated,
          activationDate,
        }),
      }
    );
    console.log(result);
    req.session.set("orderId", result.orderReference);
    const newQuote = await fetch(
      `${process.env.HANSEN_CPQ_V2_BASE_URL}/quotes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteType: 0,
          customerRef: HANSEN_CUSTOMER_REF,
          items: [],
        }),
      }
    );
    req.session.set("quoteId", newQuote.id);
    await req.session.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.data.httpStatus).json(error.data);
  }
});
