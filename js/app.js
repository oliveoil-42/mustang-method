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
const colleges=[["CENG", "Engineering", "Problem sets, builds & debugging", "Start with a working prototype, then reserve separate blocks for testing and documentation. A finished build still needs time for integration.", "Computer science: reproduce one bug before changing code. Mechanical engineering: book fabrication time before the team deadline.", "Define requirements \u2192 prototype \u2192 test \u2192 integrate \u2192 document"], ["BCSM", "Science & Mathematics", "Labs, practice & research", "Count preparation, lab meetings, data analysis and reports alongside scheduled class time. Check actual course requirements rather than assuming the calendar captures everything.", "Biology: reserve post-lab time to organize observations. Mathematics: attempt proofs before office hours and bring the step where you got stuck.", "Prepare \u2192 collect \u2192 analyze \u2192 interpret \u2192 write"], ["CLA", "Liberal Arts", "Reading, writing & creative work", "Give research, drafting and revision separate appointments. Balance readings and projects with internships, rehearsals or community involvement.", "History: turn reading notes into a claim and evidence list. Communication studies: rehearse aloud before polishing slide design.", "Read \u2192 question \u2192 research \u2192 draft \u2192 revise"], ["OCOB", "Business", "Cases, teams & presentations", "Agree on owners and internal deadlines at the first team meeting. Reserve time to combine everyone\u2019s work and check the story before presenting.", "Accounting: practice a small set of problems regularly. Marketing: finish the audience analysis before designing the campaign.", "Scope \u2192 assign \u2192 analyze \u2192 combine \u2192 rehearse"], ["CAED", "Architecture & Environmental Design", "Studio, iteration & critique", "Work backward from critique day. Set a stopping point for exploration and leave room for model-making, printing and revisions.", "Architecture: test a rough model early. City and regional planning: separate field observations, analysis and presentation preparation.", "Explore \u2192 sketch \u2192 critique \u2192 refine \u2192 present"], ["CAFES", "Agriculture, Food & Environmental Sciences", "Fieldwork, labs & operations", "Plan around travel, weather, equipment and living systems. Keep a backup task ready when field conditions change.", "Animal science: count care commitments as fixed time. Food science: schedule lab preparation and cleanup alongside analysis.", "Prepare \u2192 travel \u2192 observe \u2192 process \u2192 report"]];
const select=document.querySelector('#college');function showCollege(){const c=colleges[Number(select.value)];const root=document.querySelector('#college-detail');root.replaceChildren();for(const [tag,text] of [['h3',c[2]],['p',c[3]],['p',c[4]],['p','A possible project path: '+c[5]]]){const e=document.createElement(tag);e.textContent=text;root.append(e)}}select.addEventListener('change',showCollege);showCollege();
const paths=[['I’m putting it off','Start for ten minutes','Choose one visible action: write a first sentence, solve one part, or open the project and run it. Set a short timer, then reassess.'],['Everything feels urgent','Choose the next important action','List your deadlines and responsibilities. Choose the task with the closest real consequence, then schedule one important task that is not yet urgent.'],['My week keeps changing','Build a flexible skeleton','Add fixed commitments first, including labs, work and travel. Reserve a few work blocks and leave one buffer for surprises.'],['I can’t focus','Make one task easier to stay with','Choose a specific output, close unrelated tabs and silence optional notifications. Try a short work sprint followed by a break.'],['There’s no room for me','Check your capacity','Name one thing you want time for outside school. Put it on the calendar, then reduce or renegotiate a commitment that will not fit.']];const buttons=[];paths.forEach((x,i)=>{const b=document.createElement('button');b.type='button';b.textContent=x[0];b.setAttribute('aria-pressed','false');b.onclick=()=>{buttons.forEach(v=>v.setAttribute('aria-pressed',String(v===b)));const r=document.querySelector('#recommendation');r.replaceChildren();const h=document.createElement('h3');h.textContent=x[1];const p=document.createElement('p');p.textContent=x[2];r.append(h,p)};buttons.push(b);document.querySelector('#choices').append(b)});buttons[0].click();
document.querySelector('#plan').addEventListener('submit',e=>{e.preventDefault();const labels=['Academic outcome','First action','When and where','Hidden commitment','Room for life','Buffer and boundary'];const values=[...new FormData(e.target).values()];if(values.every(v=>!v.trim())){document.querySelector('#plan-status').textContent='Add at least one intention before downloading.';return}const text=`THE MUSTANG METHOD — MY WEEK\n\n${values.map((v,i)=>labels[i]+': '+(v.trim()||'To decide')).join('\n\n')}\n\nWeekly reflection: What helped? What will I change?`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='my-mustang-week.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#plan-status').textContent='Your weekly plan has been downloaded.'});
/* Add this entire block at the END of app.js. It adds a quiz without replacing
   the existing selectable-challenge finder above. */
(() => {
  const root = document.querySelector("#strategy-quiz");
  if (!root) return;
  const questions = [
    {q:"When you look at your upcoming week, what feels hardest?",a:[["Getting started before deadlines feel urgent","start"],["Deciding which task deserves attention first","priorities"],["Making a plan that survives schedule changes","flexibility"],["Protecting focused time from interruptions","focus"],["Making room for rest and life outside school","balance"]]},
    {q:"What usually happens when you sit down to work?",a:[["I delay beginning, even when I know what to do","start"],["I jump between tasks because everything feels important","priorities"],["Something unexpected often changes my plans","flexibility"],["I get distracted or lose momentum","focus"],["I keep working and have trouble stopping","balance"]]},
    {q:"Which support would make the biggest difference?",a:[["A tiny first step that makes a task less intimidating","start"],["A clear way to sort urgent and important work","priorities"],["A flexible weekly structure with buffer time","flexibility"],["A routine for uninterrupted work sessions","focus"],["A schedule that protects personal time, too","balance"]]},
    {q:"Which change sounds most realistic to try this week?",a:[["Work for 10 minutes on a task I've been avoiding","start"],["Choose three priorities for the week","priorities"],["Block fixed commitments and leave open space","flexibility"],["Try one 25-minute focused work sprint","focus"],["Schedule one restorative activity and a stopping time","balance"]]}
  ];
  const tips = {
    start:["The 10-minute start","Make the beginning deliberately small. Choose one visible action and work for ten minutes; then decide whether to continue or take a break.",["Name the first action.","Set a 10-minute timer.","Note the next step before stopping."]],
    priorities:["Priority sorting","Separate deadline pressure from importance. Protect time for important work before it becomes urgent.",["List deadlines and commitments.","Choose one must-do, one should-do and one optional task.","Schedule the next action for your top priority."]],
    flexibility:["A flexible weekly skeleton","Build your week around fixed commitments, then add realistic work blocks. Leave buffer time so one change does not derail the whole plan.",["Add classes, labs, work and travel first.","Reserve two or three work blocks.","Leave an open buffer for changes."]],
    focus:["Focused work sprints","Choose one task and a clear stopping point. Work for a short interval without optional notifications, then take a real break.",["Write the output you want.","Silence optional notifications.","Try 25 minutes of work and a 5-minute break."]],
    balance:["Make room for the good life","Treat recovery, relationships and meaningful activities as real parts of your week—not rewards you only get after everything else is done.",["Choose one restorative or connecting activity.","Put it on your calendar.","Set a realistic stopping time for schoolwork."]]
  };
  let n=0, answers=Array(4).fill(null);
  const $=s=>root.querySelector(s), qtitle=$("#quiz-question"), opts=$("#quiz-options"),
    label=$("#quiz-progress-label"), fill=$("#quiz-progress-fill"), back=$("#quiz-back"),
    next=$("#quiz-next"), area=$("#quiz-question-area"), actions=root.querySelector(".quiz-actions"),
    result=$("#quiz-result"), progress=root.querySelector(".quiz-progress-row");
  function render(){
    const item=questions[n]; qtitle.textContent=item.q;
    label.textContent=`Question ${n+1} of 4`; fill.style.width=`${(n+1)*25}%`;
    back.disabled=n===0; next.disabled=answers[n]===null;
    next.textContent=n===3?"See my recommendation":"Next"; opts.replaceChildren();
    item.a.forEach(([word,kind],i)=>{
      const l=document.createElement("label"); l.className="quiz-option";
      const r=document.createElement("input"); r.type="radio"; r.name=`quiz-${n}`;
      r.checked=answers[n]===i; r.addEventListener("change",()=>{answers[n]=i;next.disabled=false;});
      const s=document.createElement("span"); s.textContent=word; l.append(r,s); opts.append(l);
    });
  }
  function finish(){
    const score={start:0,priorities:0,flexibility:0,focus:0,balance:0};
    answers.forEach((a,i)=>score[questions[i].a[a][1]]++);
    const winner=Object.keys(score).reduce((best,k)=>score[k]>score[best]?k:best,"start");
    const [heading,desc,steps]=tips[winner]; area.hidden=true; actions.hidden=true; progress.hidden=true; result.hidden=false; result.replaceChildren();
    const eyebrow=document.createElement("p"); eyebrow.className="eyebrow"; eyebrow.textContent="YOUR QUIZ RECOMMENDATION";
    const h=document.createElement("h3"); h.textContent=heading;
    const d=document.createElement("p"); d.textContent=desc;
    const ol=document.createElement("ol"); steps.forEach(t=>{const li=document.createElement("li");li.textContent=t;ol.append(li);});
    const note=document.createElement("p"); note.className="quiz-note"; note.textContent="This is a starting point, not a label. You can still choose a different challenge in the finder above.";
    const again=document.createElement("button"); again.type="button"; again.className="quiz-control"; again.textContent="Retake the four-question quiz"; again.addEventListener("click",reset);
    result.append(eyebrow,h,d,ol,note,again);
  }
  function reset(){n=0;answers=Array(4).fill(null);area.hidden=false;actions.hidden=false;progress.hidden=false;result.hidden=true;render();}
  back.addEventListener("click",()=>{if(n>0){n--;render();}});
  next.addEventListener("click",()=>{if(answers[n]===null)return;if(n<3){n++;render();}else finish();});
  render();
})();
