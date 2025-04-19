// In-memory storage for submissions
let submissions = [];

// Passwords for different actions
const SUBMIT_PASSWORD = "hydgg";
const ADMIN_PASSWORD = "gezondheid"; // For viewing all submissions
const CLEAR_PASSWORD = "gezondheid"; // For clearing submissions

export const actions = {
	// Handle form submission
	submit: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get("name");
		const option = formData.get("option");
		const password = formData.get("password");

		// Validate inputs
		if (!name || !option || !password) {
			return {
				success: false,
				message: "All fields are required",
			};
		}

		// Check password
		if (password !== SUBMIT_PASSWORD) {
			return {
				success: false,
				message: "Incorrect password",
			};
		}

		// Add to submissions
		submissions.push({
			name,
			option,
			timestamp: new Date().toISOString(),
		});

		return {
			success: true,
			message: "Submission successful",
			submissions,
		};
	},

	// Verify admin password for viewing all submissions
	verifyAdminPassword: async ({ request }) => {
		const formData = await request.formData();
		const password = formData.get("adminPassword");

		if (password === ADMIN_PASSWORD) {
			return {
				success: true,
				action: "viewAll",
				submissions,
			};
		} else {
			return {
				success: false,
				message: "Incorrect admin password",
			};
		}
	},

	// Verify clear password and clear submissions
	verifyClearPassword: async ({ request }) => {
		const formData = await request.formData();
		const password = formData.get("clearPassword");

		if (password === CLEAR_PASSWORD) {
			submissions = [];
			return {
				success: true,
				action: "cleared",
				message: "All submissions cleared",
				submissions: [],
			};
		} else {
			return {
				success: false,
				message: "Incorrect clear password",
			};
		}
	},
};

// Load function to get submissions
export function load() {
	return {
		submissions,
	};
}
