// DOM Elements
const tryAginButton = document.getElementById("try_button");
const teamNameA = document.getElementById("team1");
const teamNameB = document.getElementById("team2");
const totalOver = document.getElementById("total_over");
const tossButton = document.getElementById("toss_button");
const tossValue = document.getElementById("toss");
const teamForToss = document.getElementById("team_for_toss");
const teamTossSelection = document.getElementById("team_toss_selection");
const annoncements = document.getElementById("annoncements");
const firstBattingTeamName = document.getElementById("first_batting_team_name");
const firstBattingTeamScores = document.getElementById("first_batting_team_scores");
const firstBattingTeamWickets = document.getElementById("first_batting_team_wickets");
const firstBattingTeamOvers = document.getElementById("first_batting_team_overs");
const secondBattingTeamName = document.getElementById("second_batting_team_name");
const secondBattingTeamScore = document.getElementById("second_batting_team_score");
const secondBattingTeamWickets = document.getElementById("second_batting_team_wicket");
const secondBattingTeamOvers = document.getElementById("second_batting_team_overs");
const allButtons = document.querySelectorAll("#all_button button");
const h1 = document.createElement('h1')
// Variables for runs button
const one = document.getElementById("1");
const two = document.getElementById("2");
const three = document.getElementById("3");
const four = document.getElementById("4");
const five = document.getElementById("5");
const six = document.getElementById("6");
const dot = document.getElementById("dot");
const wide = document.getElementById("wide");
const out = document.getElementById("out");
const noBall = document.getElementById("no_ball");

let totalOverInNumber;
let playGame = true;
let runs = [];
let balls = [];
let overs = [];
let wickets = [];
let completedOvers = 0;
let flag = true;
let target = 0;  // Target to chase for second inning
let currentInning = 1;  // Flag for determining current inning

// Teams
let selectedTeamName;
let otherTeamName;

// Start Game
function checkingTeamNamesAndOver() {
  let isValid = true;
  // Clear previous error states
  teamNameA.classList.remove("border-red-500", "bg-red-50", "placeholder-red-500");
  teamNameB.classList.remove("border-red-500", "bg-red-50", "placeholder-red-500");
  totalOver.classList.remove("border-red-500", "bg-red-50", "placeholder-red-500");

  // Check Team 1 input
  if (teamNameA.value.trim() === "") {
    teamNameA.classList.add("border-red-500", "bg-red-50", "placeholder-red-500");
    teamNameA.setAttribute("placeholder", "Enter Team 1 Name");
    isValid = false;
  }

  // Check Team 2 input
  if (teamNameB.value.trim() === "") {
    teamNameB.classList.add("border-red-500", "bg-red-50", "placeholder-red-500");
    teamNameB.setAttribute("placeholder", "Enter Team 2 Name");
    isValid = false;
  }

  // Check Total Over input
  if (totalOver.value.trim() === "" || isNaN(Number(totalOver.value)) || Number(totalOver.value) <= 0) {
    totalOver.classList.add("border-red-500", "bg-red-50", "placeholder-red-500");
    totalOver.setAttribute("placeholder", "Enter valid overs");
    isValid = false;
  }

  return isValid; // Return true if all inputs are valid
}

tossButton.addEventListener("click", () => {
  if (!checkingTeamNamesAndOver()) {
    return; // Stop execution if inputs are invalid
  }
  totalOverInNumber = Number(totalOver.value); // Convert over to number

  // Generate a random toss outcome: 'Head' or 'Tail'
  const headTail = Math.random() < 0.5 ? "Head" : "Tail";

  // Hide the toss selection UI
  teamTossSelection.style.display = "none";

  // Clear any previous announcements
  annoncements.innerHTML = "";

  // Assign selected and other team names based on selection
  if (teamForToss.value === "Team 1") {
    selectedTeamName = teamNameA.value;
    otherTeamName = teamNameB.value;
  } else if (teamForToss.value === "Team 2") {
    selectedTeamName = teamNameB.value;
    otherTeamName = teamNameA.value;
  }

  // Determine toss result
  firstBattingTeamName.innerHTML = "";
  secondBattingTeamName.innerHTML = "";

  if (tossValue.value.toLowerCase() === headTail.toLowerCase()) {
    h1.innerHTML = `${selectedTeamName} wins the toss!`;
    firstBattingTeamName.innerHTML = `${selectedTeamName}`;
    secondBattingTeamName.innerHTML = `${otherTeamName}`;
  } else {
    h1.innerHTML = `${otherTeamName} wins the toss!`;
    firstBattingTeamName.innerHTML = `${otherTeamName}`;
    secondBattingTeamName.innerHTML = `${selectedTeamName}`;
  }

  console.log("hello")
  annoncements.appendChild(h1);
  enableButton();

  run();
  // toggleButtonStateBeforeToss();
});

// Named functions for event handlers
function handleDot() { scoreUpdate(0); }
function handleOne() { scoreUpdate(1); }
function handleTwo() { scoreUpdate(2); }
function handleThree() { scoreUpdate(3); }
function handleFour() { scoreUpdate(4); }
function handleFive() { scoreUpdate(5); }
function handleSix() { scoreUpdate(6); }
function handleWide() { extraRun(1); }
function handleNoBall() { extraRun(1); }
function handleOut() { wicketUpdate(); }

// Function to add event listeners
function run() {
  removeAllEventListeners(); // Ensure no duplicate listeners
  dot.addEventListener("click", handleDot);
  one.addEventListener("click", handleOne);
  two.addEventListener("click", handleTwo);
  three.addEventListener("click", handleThree);
  four.addEventListener("click", handleFour);
  five.addEventListener("click", handleFive);
  six.addEventListener("click", handleSix);
  wide.addEventListener("click", handleWide);
  noBall.addEventListener("click", handleNoBall);
  out.addEventListener("click", handleOut);
}

// Function to remove all event listeners
function removeAllEventListeners() {
  dot.removeEventListener("click", handleDot);
  one.removeEventListener("click", handleOne);
  two.removeEventListener("click", handleTwo);
  three.removeEventListener("click", handleThree);
  four.removeEventListener("click", handleFour);
  five.removeEventListener("click", handleFive);
  six.removeEventListener("click", handleSix);
  wide.removeEventListener("click", handleWide);
  noBall.removeEventListener("click", handleNoBall);
  out.removeEventListener("click", handleOut);
}


// Function to update the score for extra run

function extraRun(run) {
  if (currentInning === 1) {    
      runs.push(run);
      updateScoreAndOver(firstBattingTeamScores, firstBattingTeamOvers);
  } else if (currentInning === 2) {
      runs.push(run);
      updateScoreAndOver(secondBattingTeamScore, secondBattingTeamOvers);

      // Check if target is reached
      if (getTotalRuns(runs) >= target) {
          h1.innerHTML = `${secondBattingTeamName.innerHTML} wins the match!`;
          annoncements.appendChild(h1);
          disableButtons();
      }
  }
}


// Function to update the score for runs, balls, and overs
function scoreUpdate(run) {
  if (currentInning === 1) {
    runs.push(run);
    balls.push(1);
    updateScoreAndOver(firstBattingTeamScores, firstBattingTeamOvers);
  } else if (currentInning === 2) {
    runs.push(run);
    balls.push(1);
    updateScoreAndOver(secondBattingTeamScore, secondBattingTeamOvers);

    // Check if target is reached

    if (getTotalRuns(runs) >= target) {
      h1.innerHTML = `${secondBattingTeamName.innerHTML} wins the match!`;
      annoncements.appendChild(h1);
      disableButtons();         
    }
  }
}

function updateScoreAndOver(scoreElement, overElement) {
  const totalRuns = getTotalRuns(runs);
  scoreElement.innerHTML = `${totalRuns}`;

  let currentBallCount = getTotalBalls(balls);

  if (currentBallCount > 5) {
    overs.push(1); // Increment overs when 6 balls are bowled
    currentBallCount = 0;
    completedOvers = getTotalOvers(overs); // Update completed overs
    balls = []; // Reset balls for new over
  }

  overElement.innerHTML = `${completedOvers}.${currentBallCount}`;
  overChecking(completedOvers); // Check if inning should end
}

// Function to calculate total runs
function getTotalRuns(runsArray) {
  return runsArray.reduce((acc, x) => acc + x, 0);
}

// Function to calculate total balls
function getTotalBalls(ballsArray) {
  return ballsArray.reduce((acc, x) => acc + x, 0);
}

// Function to calculate total overs
function getTotalOvers(oversArray) {
  return oversArray.reduce((acc, x) => acc + x, 0);
}

function wicketUpdate() {
  if (currentInning === 1) {
    wickets.push(1);
    balls.push(1);
    updateWicketsAndOver(firstBattingTeamWickets, firstBattingTeamOvers);
  } else if (currentInning === 2) {
    wickets.push(1);
    balls.push(1);
    updateWicketsAndOver(secondBattingTeamWickets, secondBattingTeamOvers);
  }

}

function updateWicketsAndOver(wicketElement, overElement) {
  const totalWickets = wickets.reduce((acc, x) => acc + x, 0);
  wicketElement.innerHTML = `${totalWickets}`;
  let currentBallCount = balls.reduce((acc, x) => acc + x, 0);

  if (currentBallCount > 5) {
    overs.push(1);
    currentBallCount = 0;
    completedOvers = overs.reduce((acc, x) => acc + x, 0);
    balls = [];
  }
  overElement.innerHTML = `${completedOvers}.${currentBallCount}`;
  overChecking(completedOvers);
}

function overChecking(completedOvers) {
  if (completedOvers === totalOverInNumber || wickets.length >= 10) {
    if (currentInning === 1) {
      // End of the first inning
      currentInning = 2; // Switch to the second inning
      target = getTotalRuns(runs) + 1; // Set target
      secondBattingTeamName.innerHTML = `${otherTeamName}`;
      h1.innerHTML = `First inning over. Target: ${target}`;
      annoncements.appendChild(h1);
      switchInningsData();
    } else {
      // End of the match
      let firstInningsScore = parseInt(firstBattingTeamScores.innerHTML);
      let secondInningsScore = parseInt(secondBattingTeamScore.innerHTML);

      if (secondInningsScore > firstInningsScore) {
        h1.innerHTML = `${secondBattingTeamName.innerHTML} wins the match!`;
      } else if (secondInningsScore === firstInningsScore) {
        h1.innerHTML = `The match is a draw!`;
      } else {
        h1.innerHTML = `${firstBattingTeamName.innerHTML} wins the match!`;
      }
      annoncements.appendChild(h1);
      disableButtons();
    }
  }
}

function disableButtons() {
  allButtons.forEach((button) => {
    button.setAttribute("disabled", "true");
  });
}
function enableButton(){
  allButtons.forEach((button)=>{
    button.removeAttribute("disabled")
  })
}

function switchInningsData(){
  runs = [];
  balls = [];
  overs = [];
  wickets = [];
  completedOvers = 0;
  flag = true;
}

// Function to reset the game
tryAginButton.addEventListener("click", () => {
  // Reset team names and total over fields
  teamNameA.value = "";
  teamNameB.value = "";
  totalOver.value = "";

  // Reset game data
  runs = [];
  balls = [];
  overs = [];
  wickets = [];
  completedOvers = 0;
  flag = true;
  currentInning = 1;
  target = 0;

  // Show the toss selection UI
  teamTossSelection.style.display = "block";

  // Reset UI elements
  annoncements.innerHTML = "";
  firstBattingTeamName.innerHTML = "";
  firstBattingTeamScores.innerHTML = "";
  firstBattingTeamWickets.innerHTML = "";
  firstBattingTeamOvers.innerHTML = "";
  secondBattingTeamName.innerHTML = "";
  secondBattingTeamScore.innerHTML = "";
  secondBattingTeamWickets.innerHTML = "";
  secondBattingTeamOvers.innerHTML = "";

  // disable all the score buttons again
  disableButtons();

  run();  // Reattach the event listeners for scoring
});
