let reminderTime = null;
let reminderActive = false;

let alarmInterval = null;
let timeoutHandle = null;

/* CLOCK */
setInterval(() => {
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString();
}, 1000);

/* LOG */
function addLog(msg) {
  const li = document.createElement("li");
  li.innerText = new Date().toLocaleTimeString() + " - " + msg;
  document.getElementById("logList").prepend(li);
}

/* VOICE */
function speak(text, lang) {

  const msg = new SpeechSynthesisUtterance();
  msg.text = text;

  const voices = {
    en: "en-US",
    ta: "ta-IN",
    hi: "hi-IN",
    te: "te-IN"
  };

  msg.lang = voices[lang] || "en-US";
  window.speechSynthesis.speak(msg);
}

/* SET REMINDER */
function setReminder() {

  const medicine = document.getElementById("medicine").value;
  const time = document.getElementById("time").value;

  if (!medicine || !time) {
    alert("Please fill all fields");
    return;
  }

  reminderTime = time;
  reminderActive = true;

  document.getElementById("status").innerText =
    "Reminder set for " + time;

  addLog("Reminder set for " + medicine);
}

/* CHECK LOOP */
setInterval(() => {

  if (!reminderActive) return;

  const now = new Date().toTimeString().slice(0, 5);

  if (now === reminderTime) {

    reminderActive = false;

    const medicine = document.getElementById("medicine").value;
    const lang = document.getElementById("language").value;

    document.getElementById("status").innerText =
      "⏰ Time to take " + medicine;

    addLog("Reminder triggered for " + medicine);

    /* VOICE LOOP */
    alarmInterval = setInterval(() => {
      speak("Time to take your medicine " + medicine, lang);

      if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
      }
    }, 5000);

    /* MISSED CHECK */
    timeoutHandle = setTimeout(() => {

      if (alarmInterval) clearInterval(alarmInterval);

      const caregiver = document.getElementById("caregiver").value;

      const smsText = encodeURIComponent(
        "Missed medicine: " + medicine
      );

      addLog("Missed medicine alert sent");

      window.location.href =
        "sms:" + caregiver + "?body=" + smsText;

    }, 60000);
  }

}, 1000);

/* MARK AS TAKEN */
function markTaken() {

  const medicine = document.getElementById("medicine").value;

  reminderActive = false;

  if (alarmInterval) clearInterval(alarmInterval);
  if (timeoutHandle) clearTimeout(timeoutHandle);

  window.speechSynthesis.cancel();

  document.getElementById("status").innerText =
    "✅ Medicine Taken Successfully";

  addLog(medicine + " taken successfully");
}

/* CALL CAREGIVER */
function callCaregiver() {
  const num = document.getElementById("caregiver").value;
  window.location.href = "tel:" + num;
}

/* AMBULANCE */
function callAmbulance() {
  window.location.href = "tel:108";
}
