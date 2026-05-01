const habits = [
  "Tahajjud","Fajr","Dhuhr","Asr","Maghrib","Isha","Istighfar",
  "Running","Sleep 7h","Study","Revision","LeetCode","Coding Rev",
  "Outreach","Asset Work","Sales Practice","Sales Learn"
];

let data = JSON.parse(localStorage.getItem("habitData")) || {};

const datePicker = document.getElementById("datePicker");
const habitsDiv = document.getElementById("habits");

function getToday() {
  return new Date().toISOString().split("T")[0];
}

datePicker.value = getToday();

function toggleHabit(date, habit) {
  if (!data[date]) data[date] = {};
  data[date][habit] = data[date][habit] ? 0 : 1;
  save();
  render();
}

function getScore(date) {
  let day = data[date] || {};
  let total = habits.length;
  let done = habits.reduce((a,h)=>a+(day[h]||0),0);
  return Math.round((done/total)*100);
}

function getStreak() {
  let dates = Object.keys(data).sort().reverse();
  let streak = 0;
  for (let d of dates) {
    if (getScore(d) >= 85) streak++;
    else break;
  }
  return streak;
}

function getLast7Days() {
  let arr = [];
  for (let i=6;i>=0;i--) {
    let d = new Date();
    d.setDate(d.getDate()-i);
    arr.push(d.toISOString().split("T")[0]);
  }
  return arr;
}

function getWeeklyAvg() {
  let days = getLast7Days();
  let scores = days.map(d=>getScore(d));
  let valid = scores.filter(s=>s>0);
  if (!valid.length) return 0;
  return Math.round(valid.reduce((a,b)=>a+b,0)/valid.length);
}

function save() {
  localStorage.setItem("habitData", JSON.stringify(data));
}

function render() {
  let date = datePicker.value;

  habitsDiv.innerHTML = "";
  habits.forEach(h => {
    let btn = document.createElement("button");
    btn.innerText = h;
    btn.className = (data[date]?.[h]) ? "done" : "notdone";
    btn.onclick = () => toggleHabit(date, h);
    habitsDiv.appendChild(btn);
  });

  document.getElementById("score").innerText = getScore(date);
  document.getElementById("streak").innerText = getStreak();
  document.getElementById("weekly").innerText = getWeeklyAvg();

  renderCalendar();
}

function renderCalendar() {
  let cal = document.getElementById("calendar");
  cal.innerHTML = "";

  getLast7Days().forEach(d => {
    let div = document.createElement("div");
    div.className = "day";

    let score = getScore(d);
    div.innerHTML = `
      <div>${d.slice(5)}</div>
      <div class="${score>=85?'green':'red'}">${score}%</div>
    `;

    cal.appendChild(div);
  });
}

datePicker.addEventListener("change", render);

render();
