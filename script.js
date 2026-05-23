const labels = {

  en:{
    reminder:"Time to take",
    success:"Medicine Taken Successfully",
    missed:"Patient missed medicine"
  },

  ta:{
    reminder:"மருந்து நேரம்",
    success:"மருந்து எடுத்துக்கொண்டார்",
    missed:"மருந்து தவறவிட்டார்"
  },

  hi:{
    reminder:"दवा का समय",
    success:"दवा ली गई",
    missed:"दवा छूट गई"
  },

  te:{
    reminder:"మందు సమయం",
    success:"మందు తీసుకున్నారు",
    missed:"మందు మర్చిపోయారు"
  }
};

let reminderTriggered = false;
let alarmInterval;

/* ================= APK / WEBVIEW AUDIO UNLOCK ================= */
document.addEventListener("click", () => {

  const audio = document.getElementById("alarm");

  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(() => {});

  speechSynthesis.resume();

}, { once: true });


/* ================= CLOCK ================= */
setInterval(() => {
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString().slice(0,5);
}, 1000);


/* ================= LOG ================= */
function addLog(msg){
  const li = document.createElement("li");
  li.innerText = new Date().toLocaleTimeString() + " - " + msg;
  document.getElementById("logList").prepend(li);
}


/* ================= SET REMINDER ================= */
function setReminder(){

  const medicine = document.getElementById("medicine").value;
  const time = document.getElementById("time").value;

  if(!medicine || !time){
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("medicine", medicine);
  localStorage.setItem("time", time);

  reminderTriggered = false;

  document.getElementById("status").innerText =
    "✅ Reminder set for " + time;

  addLog("Reminder set: " + medicine);
}


/* ================= MARK AS TAKEN ================= */
function markTaken(){

  clearInterval(alarmInterval);

  const audio = document.getElementById("alarm");
  audio.pause();
  audio.currentTime = 0;

  speechSynthesis.cancel();

  document.getElementById("status").innerText =
    "✅ Medicine Taken Successfully";

  addLog("Medicine taken");
}


/* ================= REMINDER CHECK ================= */
function checkReminder(){

  const now = new Date().toTimeString().slice(0,5);
  const savedTime = localStorage.getItem("time");

  if(now === savedTime && !reminderTriggered){

    reminderTriggered = true;

    const medicine = localStorage.getItem("medicine");
    const lang = document.getElementById("language").value;

    const audio = document.getElementById("alarm");

    document.getElementById("status").innerText =
      "⏰ " + labels[lang].reminder + " - " + medicine;

    addLog("Alarm started: " + medicine);

    /* ================= SAFE ALARM LOOP FOR WEBVIEW ================= */
    alarmInterval = setInterval(() => {

      /* SOUND */
      audio.currentTime = 0;
      audio.play().catch(() => {});

      /* VOICE */
      speechSynthesis.cancel();

      const langMap = {
        en: "en-US",
        ta: "ta-IN",
        hi: "hi-IN",
        te: "te-IN"
      };

      const msg = new SpeechSynthesisUtterance(
        labels[lang].reminder + " " + medicine
      );

      msg.lang = langMap[lang] || "en-US";

      setTimeout(() => {
        speechSynthesis.speak(msg);
      }, 250);

    }, 5000);


    /* ================= MISSED ALERT ================= */
    setTimeout(() => {

      clearInterval(alarmInterval);

      const caregiver = document.getElementById("caregiver").value;

      const msg = encodeURIComponent(
        labels[lang].missed + ": " + medicine
      );

      window.location.href = "sms:" + caregiver + "?body=" + msg;

    }, 60000);

  }
}

setInterval(checkReminder, 1000);


/* ================= CALL ================= */
function callCaregiver(){
  const num = document.getElementById("caregiver").value;
  window.location.href = "tel:" + num;
}

function callAmbulance(){
  window.location.href = "tel:108";
}
