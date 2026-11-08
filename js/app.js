async function loadContent(file){const response=await fetch(`content/${file}`);if(!response.ok)throw new Error(`Could not load ${file}`);return response.json()}
function card(title,description,meta=""){const article=document.createElement("article");article.className="card";const heading=document.createElement("h3");heading.textContent=title;const paragraph=document.createElement("p");paragraph.textContent=description;article.append(heading,paragraph);if(meta){const small=document.createElement("p");small.style.marginTop="10px";small.style.fontSize="11px";small.textContent=meta;article.append(small)}return article}
async function render(){try{
 const [strategies,colleges,interviews,activities]=await Promise.all([loadContent("strategies.json"),loadContent("colleges.json"),loadContent("interviews.json"),loadContent("good-life.json")]);
 strategies.forEach(x=>document.querySelector("#strategy-list").append(card(x.name,x.description)));
 colleges.forEach(x=>document.querySelector("#college-list").append(card(x.name,x.advice)));
 interviews.filter(x=>x.published===true&&x.permissionConfirmed===true).forEach(x=>document.querySelector("#interview-list").append(card(x.name+" · "+x.major,x.quote,`Graduation year: ${x.graduationYear} · Favorite strategy: ${x.favoriteStrategy}`)));
 if(!interviews.some(x=>x.published===true&&x.permissionConfirmed===true)){document.querySelector("#interview-list").append(card("Senior interviews coming soon","We're collecting and reviewing student perspectives. Check back as new interviews are approved."))}
 activities.forEach(x=>document.querySelector("#good-life-list").append(card(x.title,x.description)));
 }catch(error){console.error(error);document.querySelector("main").insertAdjacentHTML("beforeend",'<p class="section">Some content could not be loaded. Please check the content files.</p>')}}
render();// Interactive strategy quiz. Paste this at the END of your existing js/app.js.
(() => {
  const root = document.getElementById("strategy-quiz");
  if (!root) return;

  const questions = [
    { q: "What is your biggest time-management challenge?", a: [
      ["I put things off until the deadline is close.", "procrastination"],
      ["I have too many tasks and do not know where to start.", "overwhelm"],
      ["My schedule changes a lot from day to day.", "structure"],
      ["I get distracted when I try to focus.", "focus"]
    ]},
    { q: "When do you usually start a large assignment?", a: [
      ["Right before it is due.", "procrastination"],
      ["I start, but struggle to break it into steps.", "overwhelm"],
      ["I work on it when I find an open time.", "structure"],
      ["I start early but get pulled away by distractions.", "focus"]
    ]},
    { q: "What would help your week feel more manageable?", a: [
      ["A way to get started sooner.", "procrastination"],
      ["A clear list of what matters most.", "overwhelm"],
      ["A predictable plan that still has flexibility.", "structure"],
      ["Longer stretches of uninterrupted work.", "focus"]
    ]},
    { q: "Which statement sounds most like you?", a: [
      ["I work best with a short deadline or a quick first step.", "procrastination"],
      ["I need to see all my responsibilities in one place.", "overwhelm"],
      ["I want routines, but I need room to adjust.", "structure"],
      ["I need fewer interruptions and a better focus routine.", "focus"]
    ]}
  ];

  const tips = {
    procrastination: ["Try the 10-minute start",
      "Choose one assignment and work on it for just 10 minutes. Make the first step specific—open the prompt, outline three ideas, or find one source.",
      ["Write down the very first action.", "Set a 10-minute timer.", "When it ends, take a short break or continue."]],
    overwhelm: ["Try a priority-first weekly plan",
      "Get every task out of your head and onto one list. Identify the three most important outcomes for the week, then break each into smaller actions.",
      ["List deadlines and responsibilities.", "Mark the three highest-priority tasks.", "Schedule the next small action for each."]],
    structure: ["Try flexible time blocking",
      "Reserve calendar blocks for classes, studying, work, and rest. Leave open space for the unexpected instead of planning every minute.",
      ["Add fixed commitments first.", "Reserve realistic study blocks.", "Keep at least one flexible buffer."]],
    focus: ["Try a focused-work sprint",
      "Create a distraction-light environment and work on one task for a short, defined period. Try 25 minutes of focus followed by a 5-minute break.",
      ["Choose one task and silence notifications.", "Focus for 25 minutes.", "Take a 5-minute break."]]
  };

  let step = 0;
  const answers = Array(questions.length).fill(null);
  const title = root.querySelector("#question-title");
  const options = root.querySelector("#answer-options");
  const progress = root.querySelector("#quiz-progress");
  const fill = root.querySelector("#progress-fill");
  const back = root.querySelector("#back-button");
  const next = root.querySelector("#next-button");
  const content = root.querySelector("#quiz-content");
  const controls = root.querySelector(".quiz-controls");
  const result = root.querySelector("#quiz-result");

  function render() {
    const item = questions[step];
    title.textContent = item.q;
    progress.textContent = `Question ${step + 1} of ${questions.length}`;
    fill.style.width = `${(step + 1) / questions.length * 100}%`;
    back.disabled = step === 0;
    next.disabled = answers[step] === null;
    next.textContent = step === questions.length - 1 ? "See my strategy" : "Next";
    options.replaceChildren();

    item.a.forEach(([label, type], index) => {
      const choice = document.createElement("label");
      choice.className = "quiz-answer";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "mustang-quiz-question";
      radio.checked = answers[step] === index;
      radio.addEventListener("change", () => {
        answers[step] = index;
        next.disabled = false;
      });
      const text = document.createElement("span");
      text.textContent = label;
      choice.append(radio, text);
      options.append(choice);
    });
  }

  function finish() {
    const scores = { procrastination: 0, overwhelm: 0, structure: 0, focus: 0 };
    answers.forEach((answerIndex, questionIndex) => {
      scores[questions[questionIndex].a[answerIndex][1]]++;
    });
    const winner = Object.keys(scores).reduce((a, b) => scores[b] > scores[a] ? b : a);
    const [heading, description, actions] = tips[winner];
    content.hidden = true;
    controls.hidden = true;
    root.querySelector(".quiz-topline").hidden = true;
    result.hidden = false;
    result.replaceChildren();

    const eyebrow = document.createElement("p");
    eyebrow.className = "quiz-eyebrow";
    eyebrow.textContent = "Your suggested starting point";
    const h = document.createElement("h3");
    h.textContent = heading;
    const p = document.createElement("p");
    p.textContent = description;
    const list = document.createElement("ol");
    actions.forEach(action => {
      const li = document.createElement("li");
      li.textContent = action;
      list.append(li);
    });
    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "quiz-button";
    restart.textContent = "Retake the quiz";
    restart.addEventListener("click", () => {
      step = 0;
      answers.fill(null);
      content.hidden = false;
      controls.hidden = false;
      root.querySelector(".quiz-topline").hidden = false;
      result.hidden = true;
      render();
    });
    result.append(eyebrow, h, p, list, restart);
  }

  back.addEventListener("click", () => {
    if (step > 0) { step--; render(); }
  });
  next.addEventListener("click", () => {
    if (answers[step] === null) return;
    if (step < questions.length - 1) { step++; render(); }
    else finish();
  });
  render();
})();
