import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        //User.find finds ALL users rather than ONE | $ne = not equal | .select("-password") excludes password attribute from each user in json response
        // we are finding any users besides the current one
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId}})
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}