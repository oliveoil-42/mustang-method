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
render();