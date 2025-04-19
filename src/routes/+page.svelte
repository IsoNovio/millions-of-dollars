<script>
import { enhance } from "$app/forms";

export let data;
export let form;

// Options for the dropdown
const options = [
	"The Tech",
	"The Acrobat",
	"The Brute",
	"The Mentalist",
	"The Brain",
	"The Driver",
];

// View states
let activeView = "submissions"; // 'submissions', 'random', 'all'
let selectedOptions = [];

// Modal states
let showAdminModal = false;
let showClearModal = false;
let adminPassword = "";
let clearPassword = "";
let passwordError = "";

// Function to shuffle and select random submissions
function selectRandomSubmissions() {
	if (data.submissions.length <= 1) {
		selectedOptions = [];
		activeView = "random";
		return;
	}

	// Create a copy of submissions to shuffle
	const submissionsCopy = [...data.submissions];

	// Shuffle the array (Fisher-Yates algorithm)
	for (let i = submissionsCopy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[submissionsCopy[i], submissionsCopy[j]] = [
			submissionsCopy[j],
			submissionsCopy[i],
		];
	}

	// Take N-1 submissions where N is the total number of submissions
	const numToSelect = Math.max(0, data.submissions.length - 1);
	const selectedSubmissions = submissionsCopy.slice(0, numToSelect);

	// Extract only the options
	selectedOptions = selectedSubmissions.map((sub) => sub.option);

	// Show the results
	activeView = "random";
}

// Show all submissions with details (after password verification)
function promptAdminPassword() {
	showAdminModal = true;
	adminPassword = "";
	passwordError = "";
}

// Prompt for clear password
function promptClearPassword() {
	showClearModal = true;
	clearPassword = "";
	passwordError = "";
}

// Handle admin password form submission result
$: if (form?.action === "viewAll" && form?.success) {
	showAdminModal = false;
	activeView = "all";
} else if (form?.action === "cleared" && form?.success) {
	showClearModal = false;
	activeView = "submissions";
}

// Reset to basic submissions view
function showBasicSubmissions() {
	activeView = "submissions";
	selectedOptions = [];
}

// Close modals
function closeModals() {
	showAdminModal = false;
	showClearModal = false;
	passwordError = "";
}
</script>

<main>
  <h1>Form Submission App</h1>

  <section class="form-section">
    <h2>Submit Your Choice</h2>

    <form method="POST" action="?/submit" use:enhance>
      <div class="form-group">
        <label for="name">Your Name:</label>
        <input type="text" id="name" name="name" required>
      </div>

      <div class="form-group">
        <label for="option">Select an Option:</label>
        <select id="option" name="option" required>
          <option value="">-- Select an option --</option>
          {#each options as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
      </div>

      <button type="submit" class="btn submit-btn">Submit</button>
    </form>

    {#if form?.message && !form?.action}
      <div class="message {form?.success ? 'success' : 'error'}">
        {form.message}
      </div>
    {/if}
  </section>

  <section class="submissions-section">
    <h2>Submissions</h2>

    {#if data.submissions.length > 0}
      <!-- Basic submissions view -->
      {#if activeView === 'submissions'}
        <ul class="submissions-list">
          {#each data.submissions as submission}
            <li>
              <strong>{submission.name}</strong> has submitted
            </li>
          {/each}
        </ul>

      <!-- Random selection view -->
      {:else if activeView === 'random'}
        <div class="random-selection">
          <h3>Random Selection Results</h3>
          {#if selectedOptions.length > 0}
            <p>
              {selectedOptions.join(', ')} {selectedOptions.length === 1 ? 'is' : 'are'} selected
            </p>
          {:else}
            <p>No options to select from or not enough submissions.</p>
          {/if}
        </div>

      <!-- All submissions with details view -->
      {:else if activeView === 'all'}
        <div class="all-submissions">
          <h3>Complete Submission Details</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Selected Option</th>
              </tr>
            </thead>
            <tbody>
              {#each data.submissions as submission}
                <tr>
                  <td>{submission.name}</td>
                  <td>{submission.option}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <!-- Action buttons -->
      <div class="actions">
        {#if activeView !== 'submissions'}
          <button class="btn back-btn" on:click={showBasicSubmissions}>
            Back to Submissions
          </button>
        {/if}

        {#if activeView === 'submissions'}
          <button class="btn select-btn" on:click={selectRandomSubmissions}>
            Select {Math.max(0, data.submissions.length - 1)} Random Submissions
          </button>

          <button class="btn all-btn" on:click={promptAdminPassword}>
            Show All Selections
          </button>

          <button class="btn clear-btn" on:click={promptClearPassword}>
            Clear All Submissions
          </button>
        {/if}
      </div>

    {:else}
      <p>No submissions yet.</p>
    {/if}
  </section>

  <!-- Admin Password Modal -->
  {#if showAdminModal}
    <div class="modal-overlay">
      <div class="modal">
        <h3>Admin Access Required</h3>
        <p>Please enter the admin password to view all submissions:</p>

        <form method="POST" action="?/verifyAdminPassword" use:enhance>
          <div class="form-group">
            <input
              type="password"
              id="adminPassword"
              name="adminPassword"
              bind:value={adminPassword}
              required
              autofocus
            >
          </div>

          {#if form?.message && !form?.success && form?.action !== 'cleared'}
            <div class="message error">
              {form.message}
            </div>
          {/if}

          <div class="modal-actions">
            <button type="button" class="btn cancel-btn" on:click={closeModals}>
              Cancel
            </button>
            <button type="submit" class="btn confirm-btn">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Clear Password Modal -->
  {#if showClearModal}
    <div class="modal-overlay">
      <div class="modal">
        <h3>Confirm Clear All</h3>
        <p>Please enter the clear password to remove all submissions:</p>

        <form method="POST" action="?/verifyClearPassword" use:enhance>
          <div class="form-group">
            <input
              type="password"
              id="clearPassword"
              name="clearPassword"
              bind:value={clearPassword}
              required
              autofocus
            >
          </div>

          {#if form?.message && !form?.success && form?.action !== 'viewAll'}
            <div class="message error">
              {form.message}
            </div>
          {/if}

          <div class="modal-actions">
            <button type="button" class="btn cancel-btn" on:click={closeModals}>
              Cancel
            </button>
            <button type="submit" class="btn confirm-btn">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    color: #333;
  }

  section {
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .submit-btn {
    background-color: #4CAF50;
    color: white;
  }

  .select-btn {
    background-color: #2196F3;
    color: white;
  }

  .all-btn {
    background-color: #9C27B0;
    color: white;
  }

  .back-btn {
    background-color: #607D8B;
    color: white;
  }

  .clear-btn {
    background-color: #f44336;
    color: white;
  }

  .cancel-btn {
    background-color: #9E9E9E;
    color: white;
  }

  .confirm-btn {
    background-color: #FF9800;
    color: white;
  }

  .message {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
  }

  .success {
    background-color: #DFF2BF;
    color: #4F8A10;
  }

  .error {
    background-color: #FFBABA;
    color: #D8000C;
  }

  .submissions-list {
    list-style-type: none;
    padding: 0;
  }

  .submissions-list li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .random-selection, .all-submissions {
    margin-top: 20px;
    padding: 15px;
    border-radius: 4px;
  }

  .random-selection {
    background-color: #E3F2FD;
  }

  .random-selection h3 {
    margin-top: 0;
    color: #1565C0;
  }

  .all-submissions {
    background-color: #F3E5F5;
  }

  .all-submissions h3 {
    margin-top: 0;
    color: #6A1B9A;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  table th, table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  table tr:hover {
    background-color: #f9f9f9;
  }

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal h3 {
    margin-top: 0;
    color: #333;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
