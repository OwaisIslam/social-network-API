const router = require("express").Router();
const {
	getAllThoughts,
	getThoughtById,
	createThought,
	updateThought,
	deleteThought,
	addReaction,
	removeReaction,
} = require("../../controllers/thought-controller");


// /api/thoughts
router.route("/").get(getAllThoughts);

// /api/thoughts/<thoughtId>
router.route("/:thoughtId").get(getThoughtById).put(updateThought);

// /api/thoughts/<userId>
router.route("/:userId").post(createThought);

// /api/thoughts/<userId>/<thoughtId>
router.route("/:userId/:thoughtId").post(addReaction).delete(deleteThought);

// /api/thoughts/<userId>/<thoughtId>/<reactionId>
router.route("/:userId/:thoughtId/:reactionId").delete(removeReaction);


module.exports = router;