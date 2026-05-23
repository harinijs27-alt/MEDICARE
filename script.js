const labels = {
  en: {
    medicine: "Medicine Name",
    time: "Reminder Time",
    language: "Select Language",
    caregiver: "Caregiver Number",
    set: "Set Reminder",
    taken: "Mark as Taken",
    call: "Call Caregiver",
    ambulance: "Ambulance",
    reminder: "Time to take",
    success: "Medicine Taken Successfully",
    missed: "Patient missed medicine"
  },

  ta: {
    medicine: "மருந்து பெயர்",
    time: "நேரம்",
    language: "மொழி",
    caregiver: "பராமரிப்பாளர்",
    set: "அமைக்கவும்",
    taken: "எடுத்துக்கொண்டேன்",
    call: "அழைக்கவும்",
    ambulance: "அம்புலன்ஸ்",
    reminder: "மருந்து நேரம்",
    success: "மருந்து எடுத்துக்கொண்டார்",
    missed: "மருந்து தவறவிட்டார்"
  }
};

let reminderTime = null;
let active = false;
let alarmInterval = null;
let missTimeout = null;

/* CLOCK */
setInterval(() => {
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString().slice(0,5);
}, 1000);

/* LOG */
function log(msg) {
  const li = document.createElement("li");
  li.innerText = new Date().toLocaleTimeString() + " - " + msg;
  document.getElementById("logList").prepend(li);
}

/* SPEECH */
function speak(text, lang) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  speechSynthesis.speak(msg);
}

/* LANGUAGE */
function changeLanguage() {
  const lang = document.getElementById("language").value;

  document.getElementById("medicineLabel").innerText = labels[lang].medicine;
  document.getElementById("timeLabel").innerText = labels[lang].time;
  document.getElementById("languageLabel").innerText = labels[lang].language;
  document.getElementById("caregiverLabel").innerText = labels[lang].caregiver;

  document.getElementById("setBtn").innerText = labels[lang].set;
  document.getElementById("takenBtn").innerText = labels[lang].taken;
}

/* SET REMINDER */
function setReminder() {

  const medicine = document.getElementById("medicine").value;
  const time = document.getElementById("time").value;

  if (!medicine || !time) {
    alert("Fill all fields");
    return;
  }

  reminderTime = time;
  active = true;

  document.getElementById("status").innerText =
    "Reminder set for " + time;

  log("Reminder set: " + medicine);
}

/* CHECK LOOP */
setInterval(() => {

  if (!active) return;

  const now = new Date().toTimeString().slice(0,5);

  if (now === reminderTime) {

    active = false;

    const medicine = document.getElementById("medicine").value;
    const lang = document.getElementById("language").value;

    document.getElementById("status").innerText =
      labels[lang].reminder + " " + medicine;

    log("Reminder triggered");

    alarmInterval = setInterval(() => {

      speak("Take your medicine " + medicine, lang);

      document.getElementById("alarm").play().catch(()=>{});

    }, 5000);

    missTimeout = setTimeout(() => {

      clearInterval(alarmInterval);

      const caregiver = document.getElementById("caregiver").value;

      const msg = encodeURIComponent(
        labels[lang].missed + ": " + medicine
      );

      log("Missed alert sent");

      window.location.href =
        "sms:" + caregiver + "?body=" + msg;

    }, 60000);
  }

}, 1000);

/* MARK AS TAKEN */
function markTaken() {

  active = false;

  clearInterval(alarmInterval);
  clearTimeout(missTimeout);

  speechSynthesis.cancel();

  const audio = document.getElementById("alarm");
  audio.pause();
  audio.currentTime = 0;

  document.getElementById("status").innerText =
    "✅ Medicine Taken Successfully";

  log("Medicine taken");
}

/* CALL */
function callCaregiver() {
  const num = document.getElementById("caregiver").value;
  window.location.href = "tel:" + num;
}

/* AMBULANCE */
function callAmbulance() {
  window.location.href = "tel:108";
}
