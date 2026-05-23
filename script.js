const labels = {

  en:{
    medicine:"Medicine Name",
    time:"Reminder Time",
    language:"Select Language",
    caregiver:"Caregiver Number",
    set:"Set Reminder",
    taken:"Mark as Taken",
    call:"Call Caregiver",
    ambulance:"Ambulance",
    reminder:"Time to take",
    success:"Medicine Taken Successfully",
    missed:"Patient missed medicine"
  },

  ta:{
    medicine:"மருந்து பெயர்",
    time:"நினைவூட்டும் நேரம்",
    language:"மொழியை தேர்ந்தெடுக்கவும்",
    caregiver:"பராமரிப்பாளர் எண்",
    set:"நினைவூட்டலை அமைக்கவும்",
    taken:"மருந்து எடுத்துக்கொண்டேன்",
    call:"அழைக்கவும்",
    ambulance:"ஆம்புலன்ஸ்",
    reminder:"மருந்து எடுத்துக்கொள்ள நேரம்",
    success:"மருந்து வெற்றிகரமாக எடுத்துக்கொள்ளப்பட்டது",
    missed:"நோயாளர் மருந்தை தவறவிட்டார்"
  },

  hi:{
    medicine:"दवा का नाम",
    time:"रिमाइंडर समय",
    language:"भाषा चुनें",
    caregiver:"देखभालकर्ता नंबर",
    set:"रिमाइंडर सेट करें",
    taken:"दवा ले ली",
    call:"कॉल करें",
    ambulance:"एम्बुलेंस",
    reminder:"दवा लेने का समय",
    success:"दवा सफलतापूर्वक ली गई",
    missed:"रोगी दवा लेना भूल गया"
  },

  te:{
    medicine:"మందు పేరు",
    time:"రిమైండర్ సమయం",
    language:"భాష ఎంచుకోండి",
    caregiver:"కేర్ గివర్ నంబర్",
    set:"రిమైండర్ సెట్ చేయండి",
    taken:"మందు తీసుకున్నాను",
    call:"కాల్ చేయండి",
    ambulance:"అంబులెన్స్",
    reminder:"మందు తీసుకునే సమయం",
    success:"మందు విజయవంతంగా తీసుకున్నారు",
    missed:"రోగి మందు మర్చిపోయారు"
  }

};

let reminderTriggered = false;

let alarmInterval;

function updateClock(){

  const now = new Date();

  document.getElementById("clock")
  .innerHTML =
  now.toLocaleTimeString();

}

setInterval(updateClock,1000);

function changeLanguage(){

  const lang =
  document.getElementById("language").value;

  document.getElementById("medicineLabel")
  .innerHTML =
  "💊 " + labels[lang].medicine;

  document.getElementById("timeLabel")
  .innerHTML =
  "⏰ " + labels[lang].time;

  document.getElementById("languageLabel")
  .innerHTML =
  "🌍 " + labels[lang].language;

  document.getElementById("caregiverLabel")
  .innerHTML =
  "📞 " + labels[lang].caregiver;

  document.getElementById("setBtn")
  .innerHTML =
  labels[lang].set;

  document.getElementById("takenBtn")
  .innerHTML =
  labels[lang].taken;

  document.getElementById("callBtn")
  .innerHTML =
  labels[lang].call;

  document.getElementById("ambulanceBtn")
  .innerHTML =
  labels[lang].ambulance;

}

function addLog(message){

  const li =
  document.createElement("li");

  li.innerHTML =
  `${new Date().toLocaleTimeString()}
  - ${message}`;

  document.getElementById("logList")
  .prepend(li);

}

function setReminder(){

  const medicine =
  document.getElementById("medicine").value;

  const time =
  document.getElementById("time").value;

  if(!medicine || !time){

    alert("Please fill all fields");

    return;

  }

  localStorage.setItem(
    "medicine",
    medicine
  );

  localStorage.setItem(
    "time",
    time
  );

  reminderTriggered = false;

  document.getElementById("status")
  .innerHTML =
  `✅ Reminder set for ${time}`;

  addLog(
    `Reminder created for ${medicine}`
  );

}

function markTaken(){

  clearInterval(alarmInterval);

  const medicine =
  localStorage.getItem("medicine");

  const lang =
  document.getElementById("language").value;

  const audio =
  document.getElementById("alarm");

  audio.pause();

  audio.currentTime = 0;

  speechSynthesis.cancel();

  document.getElementById("status")
  .innerHTML =
  `✅ ${labels[lang].success}`;

  addLog(
    `${medicine} taken successfully`
  );

}

function checkReminder(){

  const current =
  new Date()
  .toTimeString()
  .substring(0,5);

  const savedTime =
  localStorage.getItem("time");

  if(
    current === savedTime &&
    !reminderTriggered
  ){

    reminderTriggered = true;

    const medicine =
    localStorage.getItem("medicine");

    const lang =
    document.getElementById("language").value;

    const audio =
    document.getElementById("alarm");

    // Continuous alarm every 5 seconds
    alarmInterval = setInterval(()=>{

      audio.currentTime = 0;

      audio.play();

      const speech =
      new SpeechSynthesisUtterance(
        `${labels[lang].reminder}
        ${medicine}`
      );

      speech.lang = lang;

      speechSynthesis.speak(speech);

    },5000);

    document.getElementById("status")
    .innerHTML =
    `⏰ ${labels[lang].reminder}
    ${medicine}`;

    addLog(
      `Reminder alert started for ${medicine}`
    );

    // Stop after 1 minute
    setTimeout(()=>{

      clearInterval(alarmInterval);

      const status =
      document.getElementById("status")
      .innerHTML;

      if(status.includes("⏰")){

        const caregiver =
        document.getElementById("caregiver").value;

        const smsText =
        encodeURIComponent(
          `${labels[lang].missed}: ${medicine}`
        );

        addLog(
          `Caregiver SMS alert triggered`
        );

        window.location.href =
        `sms:${caregiver}?body=${smsText}`;

      }

    },60000);

  }

}

setInterval(checkReminder,1000);

function callCaregiver(){

  const caregiver =
  document.getElementById("caregiver").value;

  if(caregiver){

    addLog(
      `Calling caregiver`
    );

    window.location.href =
    `tel:${caregiver}`;

  }

}

function callAmbulance(){

  addLog(
    `Calling ambulance service`
  );

  window.location.href =
  "tel:108";

}
