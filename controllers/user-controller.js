const { User, Thought } = require("../models");

const userController = {
	//get all users
	getAllUsers(req, res) {
		User.find({})
			.populate({
				path: "thoughts",
				select: "-__v",
			})
			.select("-__v")
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
	// get specific user
	getUserById({ params }, res) {
		User.findOne({ _id: params.id })
			.populate([
				{
					path: "thoughts",
					select: "-__v",
				},
				{
					path: "friends",
					select: "-__v",
				},
			])
			.select("-__v")
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
	// create a new user
	createUser({ body }, res) {
		User.create(body)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.status(400).json(err));
	},
	// update an existing user
	updateUser({ params, body }, res) {
		User.findOneAndUpdate({ _id: params.id }, body, {
			new: true,
			runValidators: true,
		})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	},
	// delete a user
	deleteUser({ params }, res) {
		User.findOneAndDelete({ _id: params.id })
			.then((deletedUser) => {
				if (!deletedUser) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				User.updateMany(
					{ _id: { $in: deletedUser.friends } },
					{ $pull: { friends: params.id } }
				)
					.then(() => {
						Thought.deleteMany({ username: deletedUser.username })
							.then(() => {
								res.json({ message: "User deleted" });
							})
							.catch((err) => res.status(400).json(err));
					})
					.catch((err) => res.status(400).json(err));
			})
			.catch((err) => res.status(400).json(err));
	},
	// add a friend
	addFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $addToSet: { friends: params.friendId } },
			{ new: true, runValidators: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},
	// remove a friend
	removeFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $pull: { friends: params.friendId } },
			{ new: true }
		)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err));
	},
};

module.exports = userController;
