import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        //req params: cookies (has jwt), user (assigned at end)
        const token = req.cookies.jwt;
        //case where there is no token in the request
        if (!token) {
            return res.status(401).json({error: "Unauthorized - No Token Provided"}) //return http 401 error (unauthorized)
        }

        //remember, when we generate tokens in utils/generateToken.js, we sign using JWT_SECRET - the .env file will be in the server/backend upon deployment
        //so the server can use the secret, which is in the .env file, to verify/decode the token from the client
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //case where the verification fails
        if (!decoded) {
            return res.status(401).json({error: "Unauthorized - Invalid Token"}) //return http 401 error (unauthorized)
        }

        //assign the .userId attribute of the decoded message to user
        const user = await User.findById(decoded.userId);

        if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

        //assign request user attribute to the user we decoded using mongoose model + jwt
        //because of this line of code, we can use req.user._id instead of req.user.Id
		req.user = user;

        //this says that if everything has successfully ran by this point, exit this function and call the "next" function (passed as a parameter)
		next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export default protectRoute;