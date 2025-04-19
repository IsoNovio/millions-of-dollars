// In-memory storage for submissions
let submissions = [];

// Password for authentication (in a real app, use proper auth)
const CORRECT_PASSWORD = "hydgg";

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
		if (password !== CORRECT_PASSWORD) {
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

	// Clear all submissions
	clear: async () => {
		submissions = [];
		return {
			success: true,
			message: "All submissions cleared",
			submissions,
		};
	},
};

// Load function to get submissions
export function load() {
	return {
		submissions,
	};
}
