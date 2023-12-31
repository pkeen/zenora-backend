const {
	User,
	Course,
	CourseSlot,
	Module,
	Lesson,
	ModuleSlot,
} = require("../../db/models/index");
const handleError = require("../utils/handleError");
const FriendlyError = require("../utils/friendlyError");
const {
	getObjectOr404,
	userIsOwnerOr403,
	validateAndFormatParams,
} = require("../utils/request-database-utilities");
// const validateAndFormatParams = require("../utils/validateAndFormatParams");

const index = async (req, res) => {
	// Using the validateAndFormatParams to change fks to ints from strings
	const params = req.query;
	const query = validateAndFormatParams(Course, params);
	// console.log(query);
	try {
		// const courses = await Course.findAll({
		// 	where: query,
		// 	include: { model: User, attributes: ["name"] },
		// });
		const courses = await Course.findAll({
			where: query,
			include: [
				{
					model: User,
					// as: "User", // using "as" to alias the association, ensuring the key in the returned object is "User"
					attributes: ["id", "name"], // ... other user fields
				},
				{
					model: CourseSlot,
					// as: "CourseSlots", // using "as" to alias the association, ensuring the key in the returned object is "CourseSlots"
					attributes: ["id", "order"], // ... other course slot fields
					include: [
						{
							model: Module,
							attributes: ["id", "title", "isPublished"],
							include: [
								{
									model: ModuleSlot,
									attributes: ["id", "order"],
									include: [
										{
											model: Lesson,
											attributes: ["id", "title"],
										},
									],
								},
							],
						},
						{
							model: Lesson,
							attributes: ["id", "title", "isPublished"],
						},
					],
				},
			],
		});
		res.status(200).json(courses);
	} catch (err) {
		res.json(err);
	}
};

const create = async (req, res) => {
	try {
		const data = { ...req.body, userId: parseInt(req.user.id) };
		await Course.create(data);
		res.status(201).json("Course created");
	} catch (err) {
		console.log("sequelize error: ", err);
		const error = handleError(err);
		console.log(error);
		res.status(error.status).json(error.formatError());
	}
};

const destroy = async (req, res) => {
	try {
		// TODO add protection to route, ensure user has token and user.id matches the course.userId
		const id = req.params.id;

		const course = await getObjectOr404(id, Course); // handles getting course and errors that could occur

		// check the course belongs to user
		userIsOwnerOr403(req.user, course);

		await course.destroy();

		res.status(200).json({ message: "Course deleted successfully" });
	} catch (err) {
		if (err instanceof FriendlyError) {
			res.status(err.status).json(err.formatError());
		} else {
			console.error(err); // log the error for debugging purposes
			res.status(500).json({
				error: {
					code: "unknown_error",
					message: "An unexpected error occurred",
				},
			});
		}
	}
};

const update = async (req, res) => {
	try {
		const id = parseInt(req.params.id);

		const course = await getObjectOr404(id, Course); // handles getting course and errors that could occur

		// check the course belongs to user
		userIsOwnerOr403(req.user, course);

		// We could have validations or middleware for extra security

		await course.update(req.body);

		res.status(200).json({
			message: "Course updated successfully",
			course,
		});
	} catch (error) {
		if (err instanceof FriendlyError) {
			res.status(err.status).json(err.formatError());
		} else {
			console.error(err); // log the error for debugging purposes
			res.status(500).json({
				error: {
					code: "unknown_error",
					message: "An unexpected error occurred",
				},
			});
		}
	}
};

const getOne = async (req, res) => {
	try {
		const id = req.params.id;

		// const course = await getObjectOr404(id, Course);

		const course = await Course.findOne({
			where: { id: id }, // assuming the foreign key on the Course model is userId
			// attributes: ["id", "title"], // ... other course fields
			include: [
				{
					model: User,
					// as: "User", // using "as" to alias the association, ensuring the key in the returned object is "User"
					attributes: ["id", "name"], // ... other user fields
				},
				{
					model: CourseSlot,
					// as: "CourseSlots", // using "as" to alias the association, ensuring the key in the returned object is "CourseSlots"
					attributes: ["id", "order"], // ... other course slot fields
					include: [
						{
							model: Module,
							attributes: ["id", "title", "isPublished"],
							include: [
								{
									model: ModuleSlot,
									attributes: ["id", "order"],
									include: [
										{
											model: Lesson,
											attributes: ["id", "title"],
										},
									],
								},
							],
						},
						{
							model: Lesson,
							attributes: ["id", "title", "isPublished"],
						},
					],
				},
			],
		});

		res.status(200).json(course);
	} catch (err) {
		if (err instanceof FriendlyError) {
			res.status(err.status).json(err.formatError());
		} else {
			console.error(err); // log the error for debugging purposes
			res.status(500).json({
				error: {
					code: "unknown_error",
					message: "An unexpected error occurred",
				},
			});
		}
	}
};

module.exports = {
	index,
	create,
	destroy,
	update,
	getOne,
};
