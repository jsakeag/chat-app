import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    //JWT_SECRET is a value you store in the env file, you can make it anything but good practice to generate random base64 string
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, { 
		expiresIn: "15d", //logs you out after 15 days for security reasons
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days, converted into milliseconds
		httpOnly: true, // prevent cross-site scripting attacks (XSS)
		sameSite: "strict", // prevents cross-site request forgery attacks (CSRF) 
		secure: process.env.NODE_ENV !== "development", //this attribute is true in production but false in development (aka right now) - we'll update when deploying
	});
};

export default generateTokenAndSetCookie;