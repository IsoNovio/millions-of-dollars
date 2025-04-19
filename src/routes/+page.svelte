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

// Function to shuffle and select random submissions
function selectRandomSubmissions() {
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

	// Take up to 5 submissions
	const selectedSubmissions = submissionsCopy.slice(0, 5);

	// Extract only the options
	selectedOptions = selectedSubmissions.map((sub) => sub.option);

	// Show the results
	activeView = "random";
}

// Show all submissions with details
function showAllSubmissions() {
	activeView = "all";
}

// Reset to basic submissions view
function showBasicSubmissions() {
	activeView = "submissions";
	selectedOptions = [];
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

    {#if form?.message}
      <div class="message {form.success ? 'success' : 'error'}">
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
            <p>No options to select from.</p>
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
            Select 5 Random Submissions
          </button>

          <button class="btn all-btn" on:click={showAllSubmissions}>
            Show All Selections
          </button>
        {/if}

        <form method="POST" action="?/clear" use:enhance>
          <button type="submit" class="btn clear-btn">Clear All Submissions</button>
        </form>
      </div>

    {:else}
      <p>No submissions yet.</p>
    {/if}
  </section>
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
</style>
