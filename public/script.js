let currentQuestionIndex = 0;
let score = 0;
let loggedIn = false;

const questions = [
  {
    question: "Who is considered the father of Afrobeat music?",
    options: ["Fela Kuti", "Burna Boy", "Wizkid"],
    answer: "Fela Kuti"
  },
  {
    question: "What genre of music is Bob Marley famous for?",
    options: ["Reggae", "Hip-Hop", "Jazz"],
    answer: "Reggae"
  },
  {
    question: "Who is the African Queen of Hip-Hop?",
    options: ["M.I. Abaga", "Sista Afia", "Queen of the South"],
    answer: "M.I. Abaga"
  },
  {
    question: "In which country was the genre 'Gqom' born?",
    options: ["South Africa", "Nigeria", "Kenya"],
    answer: "South Africa"
  },
  {
    question: "Which Nigerian artist won the 2020 Grammy for Best Global Music Album?",
    options: ["Burna Boy", "Davido", "Mr Eazi"],
    answer: "Burna Boy"
  }
];

function showSignup() {
  document.getElementById("signupForm").style.display = "flex";
  document.getElementById("loginForm").style.display = "none";
}

function showLogin() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "flex";
}

function continueAsGuest() {
  document.getElementById("authContainer").style.display = "none";
  document.getElementById("storySection").style.display = "block";
  loadQuestion();
}

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const res = await fetch("/register", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.get("username"),
      password: form.get("password")
    })
  });
  const text = await res.text();
  alert(text);
  if (res.ok) showLogin();
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const res = await fetch("/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.get("username"),
      password: form.get("password")
    })
  });
  const text = await res.text();
  alert(text);
  if (res.ok) {
    loggedIn = true;
    document.getElementById("authContainer").style.display = "none";
    document.getElementById("storySection").style.display = "block";
    loadQuestion();
  }
});

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  const container = document.getElementById("questionContainer");
  container.innerHTML = `
    <p><strong>${q.question}</strong></p>
    ${q.options.map(opt => `<label><input type="radio" name="answer" value="${opt}"> ${opt}</label><br>`).join('')}
  `;
}

function nextQuestion() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return alert("Please choose an answer.");
  if (selected.value === questions[currentQuestionIndex].answer) score++;

  currentQuestionIndex++;
  document.getElementById("score").innerText = `Score: ${score}`;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    document.getElementById("storySection").style.display = "none";
    document.getElementById("musicHub").style.display = "block";
    loadSongs();
  }
}

// Load Songs
function loadSongs() {
  fetch("/songs")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("song-list");
      list.innerHTML = '';
      data.forEach(song => {
        const li = document.createElement("li");
        li.textContent = song;
        li.onclick = () => {
          document.getElementById("audio-player").src = `/music/${song}`;
        };
        list.appendChild(li);
      });
    });
}
