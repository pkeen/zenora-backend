const {
	sequelize,
	User,
	Course,
	Lesson,
	Module,
	CourseSlot,
	ModuleSlot,
	Order,
} = require("../models/index");
const {
	testConnection,
	alterSynchronize,
	seedDatabse,
} = require("./syncAndSeed");
const userSeed = require("../seeders/user-seed");
const seedCourses = require("../seeders/courses-seed");
const lessonSeed = require("../seeders/lesson-seed");
const moduleSeed = require("../seeders/module-seed");
const slotSeed = require("../seeders/course-slot-seed");
const moduleSlotSeed = require("../seeders/module-slot-seed");
const orderSeed = require("../seeders/order-seed");

const devSyncMode = async () => {
	await testConnection(sequelize);
	// await alterSynchronize(sequelize);
	await alterSynchronize(sequelize);

	// await sequelize.sync({force: true})

	// seed user?
	const userCount = await User.count();
	console.log("User Count:", userCount);
	if (userCount < 10) {
		await userSeed.up();
	}

	// Course.sync({force: true})
	// seed courses?
	const courseCount = await Course.count();
	console.log("Course count:", courseCount);
	if (courseCount < 20) {
		await seedCourses.up();
	}

	// Module seed
	const moduleCount = await Module.count();
	console.log("module count:", moduleCount);
	if (moduleCount < 30) {
		await moduleSeed.up();
	}
	// Lesson seed
	const lessonCount = await Lesson.count();
	console.log("Lesson count:", lessonCount);
	if (lessonCount < 50) {
		await lessonSeed.up();
	}

	// Course Slot seed
	const slotCount = await CourseSlot.count();
	console.log("Course Slot count:", slotCount);
	if (slotCount < 60) {
		await slotSeed.up();
	}

	// Module Slot Seed
	const moduleSlotCount = await ModuleSlot.count();
	console.log("Module Slot count:", moduleSlotCount);
	if (moduleSlotCount < 50) {
		await moduleSlotSeed.up();
	}

	// Order seed
	const orderCount = await Order.count();
	console.log("Order Count:", orderCount);
	if (orderCount < 50) {
		await orderSeed.up();
	}
};

module.exports = devSyncMode;
