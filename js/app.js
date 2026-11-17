
/* =========================================================
   THE MUSTANG METHOD
   Main website interactions
   ========================================================= */

/* ---------- 1. LOAD WEBSITE CONTENT ---------- */

async function loadContent(file) {
  const response = await fetch(`content/${file}`);
  if (!response.ok) {
    throw new Error(`Could not load ${file}`);
  }
  return response.json();
}

function card(title, description, meta = "") {
  const article = document.createElement("article");
  article.className = "card";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = description;

  article.append(heading, paragraph);

  if (meta) {
    const small = document.createElement("p");
    small.style.marginTop = "10px";
    small.style.fontSize = "11px";
    small.textContent = meta;
    article.append(small);
  }

  return article;
}

async function renderContent() {
  try {
    const [strategies, colleges, interviews, activities] =
      await Promise.all([
        loadContent("strategies.json"),
        loadContent("colleges.json"),
        loadContent("interviews.json"),
        loadContent("good-life.json")
      ]);

    const strategyList = document.querySelector("#strategy-list");
    const collegeList = document.querySelector("#college-list");
    const interviewList = document.querySelector("#interview-list");
    const goodLifeList = document.querySelector("#good-life-list");

    if (strategyList) {
      strategies.forEach(item => {
        strategyList.append(card(item.name, item.description));
      });
    }

    if (collegeList) {
      colleges.forEach(item => {
        collegeList.append(card(item.name, item.advice));
      });
    }

    if (interviewList) {
      const published = interviews.filter(
        item =>
          item.published === true &&
          item.permissionConfirmed === true
      );

      published.forEach(item => {
        interviewList.append(
          card(
            item.name + " · " + item.major,
            item.quote,
            `Graduation year: ${item.graduationYear} · Favorite strategy: ${item.favoriteStrategy}`
          )
        );
      });

      if (published.length === 0) {
        interviewList.append(
          card(
            "Senior interviews coming soon",
            "We're collecting and reviewing student perspectives. Check back as new interviews are approved."
          )
        );
      }
    }

    if (goodLifeList) {
      activities.forEach(item => {
        goodLifeList.append(card(item.title, item.description));
      });
    }

  } catch (error) {
    console.error("Website content error:", error);

    const main = document.querySelector("main");
    if (main) {
      const message = document.createElement("p");
      message.textContent =
        "Some content could not be loaded. Please check the content files.";
      main.append(message);
    }
  }
}


/* ---------- 2. COLLEGE-SPECIFIC DROPDOWN ---------- */

const collegeData = [
  [
    "CENG",
    "Engineering",
    "Problem sets, builds & debugging",
    "Start with a working prototype, then reserve separate blocks for testing and documentation. A finished build still needs time for integration.",
    "Computer science: reproduce one bug before changing code. Mechanical engineering: book fabrication time before the team deadline.",
    "Define requirements → prototype → test → integrate → document"
  ],
  [
    "BCSM",
    "Science & Mathematics",
    "Labs, practice & research",
    "Count preparation, lab meetings, data analysis and reports alongside scheduled class time. Check actual course requirements rather than assuming the calendar captures everything.",
    "Biology: reserve post-lab time to organize observations. Mathematics: attempt proofs before office hours and bring the step where you got stuck.",
    "Prepare → collect → analyze → interpret → write"
  ],
  [
    "CLA",
    "Liberal Arts",
    "Reading, writing & creative work",
    "Give research, drafting and revision separate appointments. Balance readings and projects with internships, rehearsals or community involvement.",
    "History: turn reading notes into a claim and evidence list. Communication studies: rehearse aloud before polishing slide design.",
    "Read → question → research → draft → revise"
  ],
  [
    "OCOB",
    "Business",
    "Cases, teams & presentations",
    "Agree on owners and internal deadlines at the first team meeting. Reserve time to combine everyone's work and check the story before presenting.",
    "Accounting: practice a small set of problems regularly. Marketing: finish the audience analysis before designing the campaign.",
    "Scope → assign → analyze → combine → rehearse"
  ],
  [
    "CAED",
    "Architecture & Environmental Design",
    "Studio, iteration & critique",
    "Work backward from critique day. Set a stopping point for exploration and leave room for model-making, printing and revisions.",
    "Architecture: test a rough model early. City and regional planning: separate field observations, analysis and presentation preparation.",
    "Explore → sketch → critique → refine → present"
  ],
  [
    "CAFES",
    "Agriculture, Food & Environmental Sciences",
    "Fieldwork, labs & operations",
    "Plan around travel, weather, equipment and living systems. Keep a backup task ready when field conditions change.",
    "Animal science: count care commitments as fixed time. Food science: schedule lab preparation and cleanup alongside analysis.",
    "Prepare → travel → observe → process → report"
  ]
];

function initializeCollegeDropdown() {
  const select = document.querySelector("#college");
  const detail = document.querySelector("#college-detail");

  if (!select || !detail) return;

  function showCollege() {
    const value = select.value;

    let index;

    // Supports dropdown values such as 0, 1, 2...
    if (/^\d+$/.test(value)) {
      index = Number(value);
    } else {
      // Also supports values such as CENG, BCSM, etc.
      index = collegeData.findIndex(
        college =>
          college[0] === value ||
          college[1] === value
      );
    }

    // Fallback for dropdowns with a placeholder option.
    if (index < 0 || index >= collegeData.length) {
      index = select.selectedIndex -
        (select.options[0]?.value === "" ? 1 : 0);
    }

    if (index < 0 || index >= collegeData.length) return;

    const college = collegeData[index];

    detail.replaceChildren();

    const content = [
      ["h3", college[2]],
      ["p", college[3]],
      ["p", college[4]],
      ["p", "A possible project path: " + college[5]]
    ];

    content.forEach(([tag, text]) => {
      const element = document.createElement(tag);
      element.textContent = text;
      detail.append(element);
    });
  }

  select.addEventListener("change", showCollege);

  // Show the selected college when the page loads.
  if (select.value !== "") {
    showCollege();
  }
}


/* ---------- 3. SELECTABLE CHALLENGE FINDER ---------- */

function initializeChallengeFinder() {
  const choices = document.querySelector("#choices");
  const recommendation = document.querySelector("#recommendation");

  if (!choices || !recommendation) return;

  const paths = [
    [
      "I'm putting it off",
      "Start for ten minutes",
      "Choose one visible action: write a first sentence, solve one part, or open the project and run it. Set a short timer, then reassess."
    ],
    [
      "Everything feels urgent",
      "Choose the next important action",
      "List your deadlines and responsibilities. Choose the task with the closest real consequence, then schedule one important task that is not yet urgent."
    ],
    [
      "My week keeps changing",
      "Build a flexible skeleton",
      "Add fixed commitments first, including labs, work and travel. Reserve a few work blocks and leave one buffer for surprises."
    ],
    [
      "I can't focus",
      "Make one task easier to stay with",
      "Choose a specific output, close unrelated tabs and silence optional notifications. Try a short work sprint followed by a break."
    ],
    [
      "There's no room for me",
      "Check your capacity",
      "Name one thing you want time for outside school. Put it on the calendar, then reduce or renegotiate a commitment that will not fit."
    ]
  ];

  const buttons = [];

  function showRecommendation(path, button) {
    buttons.forEach(item => {
      item.setAttribute(
        "aria-pressed",
        String(item === button)
      );
    });

    recommendation.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = path[1];

    const paragraph = document.createElement("p");
    paragraph.textContent = path[2];

    recommendation.append(heading, paragraph);
  }

  paths.forEach(path => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = path[0];
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      showRecommendation(path, button);
    });

    buttons.push(button);
    choices.append(button);
  });

  // Automatically display the first recommendation.
  if (buttons.length > 0) {
    buttons[0].click();
  }
}


/* ---------- 4. FOUR-QUESTION STRATEGY QUIZ ---------- */

function initializeStrategyQuiz() {
  const root = document.querySelector("#strategy-quiz");

  if (!root) return;

  const questions = [
    {
      q: "When you look at your upcoming week, what feels hardest?",
      a: [
        ["Getting started before deadlines feel urgent", "start"],
        ["Deciding which task deserves attention first", "priorities"],
        ["Making a plan that survives schedule changes", "flexibility"],
        ["Protecting focused time from interruptions", "focus"],
        ["Making room for rest and life outside school", "balance"]
      ]
    },
    {
      q: "What usually happens when you sit down to work?",
      a: [
        ["I delay beginning, even when I know what to do", "start"],
        ["I jump between tasks because everything feels important", "priorities"],
        ["Something unexpected often changes my plans", "flexibility"],
        ["I get distracted or lose momentum", "focus"],
        ["I keep working and have trouble stopping", "balance"]
      ]
    },
    {
      q: "Which support would make the biggest difference?",
      a: [
        ["A tiny first step that makes a task less intimidating", "start"],
        ["A clear way to sort urgent and important work", "priorities"],
        ["A flexible weekly structure with buffer time", "flexibility"],
        ["A routine for uninterrupted work sessions", "focus"],
        ["A schedule that protects personal time, too", "balance"]
      ]
    },
    {
      q: "Which change sounds most realistic to try this week?",
      a: [
        ["Work for 10 minutes on a task I've been avoiding", "start"],
        ["Choose three priorities for the week", "priorities"],
        ["Block fixed commitments and leave open space", "flexibility"],
        ["Try one 25-minute focused work sprint", "focus"],
        ["Schedule one restorative activity and a stopping time", "balance"]
      ]
    }
  ];

  const tips = {
    start: [
      "The 10-minute start",
      "Make the beginning deliberately small. Choose one visible action and work for ten minutes; then decide whether to continue or take a break.",
      [
        "Name the first action.",
        "Set a 10-minute timer.",
        "Note the next step before stopping."
      ]
    ],
    priorities: [
      "Priority sorting",
      "Separate deadline pressure from importance. Protect time for important work before it becomes urgent.",
      [
        "List deadlines and commitments.",
        "Choose one must-do, one should-do and one optional task.",
        "Schedule the next action for your top priority."
      ]
    ],
    flexibility: [
      "A flexible weekly skeleton",
      "Build your week around fixed commitments, then add realistic work blocks. Leave buffer time so one change does not derail the whole plan.",
      [
        "Add classes, labs, work and travel first.",
        "Reserve two or three work blocks.",
        "Leave an open buffer for changes."
      ]
    ],
    focus: [
      "Focused work sprints",
      "Choose one task and a clear stopping point. Work for a short interval without optional notifications, then take a real break.",
      [
        "Write the output you want.",
        "Silence optional notifications.",
        "Try 25 minutes of work and a 5-minute break."
      ]
    ],
    balance: [
      "Make room for the good life",
      "Treat recovery, relationships and meaningful activities as real parts of your week—not rewards you only get after everything else is done.",
      [
        "Choose one restorative or connecting activity.",
        "Put it on your calendar.",
        "Set a realistic stopping time for schoolwork."
      ]
    ]
  };

  // Match the IDs in your current index.html.
  const questionTitle = root.querySelector("#quiz-question");
  const options = root.querySelector("#quiz-options");
  const progressLabel = root.querySelector("#quiz-progress-label");
  const progressFill = root.querySelector("#quiz-progress-fill");
  const backButton = root.querySelector("#quiz-back");
  const nextButton = root.querySelector("#quiz-next");
  const questionArea = root.querySelector("#quiz-question-area");
  const actions = root.querySelector(".quiz-actions");
  const progressRow = root.querySelector(".quiz-progress-row");
  const result = root.querySelector("#quiz-result");

  // Stop safely if the HTML is missing a required quiz element.
  if (
    !questionTitle ||
    !options ||
    !progressLabel ||
    !progressFill ||
    !backButton ||
    !nextButton ||
    !questionArea ||
    !actions ||
    !progressRow ||
    !result
  ) {
    console.error("The quiz HTML is missing one or more required elements.");
    return;
  }

  let currentQuestion = 0;
  let answers = Array(questions.length).fill(null);

  function renderQuestion() {
    const question = questions[currentQuestion];

    questionTitle.textContent = question.q;

    progressLabel.textContent =
      `Question ${currentQuestion + 1} of ${questions.length}`;

    progressFill.style.width =
      `${(currentQuestion + 1) / questions.length * 100}%`;

    backButton.disabled = currentQuestion === 0;

    nextButton.disabled = answers[currentQuestion] === null;

    nextButton.textContent =
      currentQuestion === questions.length - 1
        ? "See my recommendation"
        : "Next";

    options.replaceChildren();

    question.a.forEach(([answerText], index) => {
      const label = document.createElement("label");
      label.className = "quiz-option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `quiz-question-${currentQuestion}`;
      radio.checked = answers[currentQuestion] === index;

      radio.addEventListener("change", () => {
        answers[currentQuestion] = index;
        nextButton.disabled = false;
      });

      const span = document.createElement("span");
      span.textContent = answerText;

      label.append(radio, span);
      options.append(label);
    });
  }

  function finishQuiz() {
    const scores = {
      start: 0,
      priorities: 0,
      flexibility: 0,
      focus: 0,
      balance: 0
    };

    answers.forEach((answerIndex, questionIndex) => {
      const category =
        questions[questionIndex].a[answerIndex][1];

      scores[category]++;
    });

    const winner = Object.keys(scores).reduce(
      (best, category) =>
        scores[category] > scores[best] ? category : best,
      "start"
    );

    const [heading, description, steps] = tips[winner];

    questionArea.hidden = true;
    actions.hidden = true;
    progressRow.hidden = true;
    result.hidden = false;

    result.replaceChildren();

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "YOUR QUIZ RECOMMENDATION";

    const title = document.createElement("h3");
    title.textContent = heading;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    const list = document.createElement("ol");

    steps.forEach(step => {
      const item = document.createElement("li");
      item.textContent = step;
      list.append(item);
    });

    const note = document.createElement("p");
    note.className = "quiz-note";
    note.textContent =
      "This is a starting point, not a label. You can still choose a different challenge in the finder above.";

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "quiz-control";
    restart.textContent = "Retake the four-question quiz";

    restart.addEventListener("click", resetQuiz);

    result.append(
      eyebrow,
      title,
      paragraph,
      list,
      note,
      restart
    );
  }

  function resetQuiz() {
    currentQuestion = 0;
    answers = Array(questions.length).fill(null);

    questionArea.hidden = false;
    actions.hidden = false;
    progressRow.hidden = false;
    result.hidden = true;

    renderQuestion();
  }

  backButton.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  });

  nextButton.addEventListener("click", () => {
    if (answers[currentQuestion] === null) return;

    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });

  renderQuestion();
}


/* ---------- 5. WEEKLY PLANNER DOWNLOAD ---------- */

function initializeWeeklyPlanner() {
  const form = document.querySelector("#plan");
  const status = document.querySelector("#plan-status");

  if (!form || !status) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const labels = [
      "Academic outcome",
      "First action",
      "When and where",
      "Hidden commitment",
      "Room for life",
      "Buffer and boundary"
    ];

    const values = [
      ...new FormData(form).values()
    ].map(value => String(value));

    if (values.every(value => !value.trim())) {
      status.textContent =
        "Add at least one intention before downloading.";
      return;
    }

    const text =
      `THE MUSTANG METHOD — MY WEEK\n\n` +
      values.map((value, index) =>
        `${labels[index] || "Additional intention"}: ${value.trim() || "To decide"}`
      ).join("\n\n") +
      `\n\nWeekly reflection: What helped? What will I change?`;

    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "my-mustang-week.txt";
    link.click();

    URL.revokeObjectURL(url);

    status.textContent =
      "Your weekly plan has been downloaded.";
  });
}


/* ---------- 6. START THE WEBSITE ---------- */

function initializeWebsite() {
  renderContent();
  initializeCollegeDropdown();
  initializeChallengeFinder();
  initializeStrategyQuiz();
  initializeWeeklyPlanner();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeWebsite,
    { once: true }
  );
} else {
  initializeWebsite();
}
