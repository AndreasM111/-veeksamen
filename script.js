// 1. Sett inn nøklene dine med anførselstegn rundt
const SUPABASE_URL = "https://tdyoicyhxpgauonfxuch.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeW9pY3loeHBnYXVvbmZ4dWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjU1OTIsImV4cCI6MjA3OTIwMTU5Mn0.e-DLsnfboe6X1O5adDtPoT8Hfdr1KKLr0H2S6jkEF8M";

// 2. Bruk et annet navn på variabelen enn "supabase" (jeg bruker _supabase)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Funksjoner for å åpne og lukke menyen (viktig for at knappene skal virke)
function aapneLoggInn() {
  document.getElementById("loginSide").style.width = "400px";
}

function lukkLoggInn() {
  document.getElementById("loginSide").style.width = "0";
}

// 4. Finn skjemaet ved hjelp av ID-en vi lagde
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stopper siden fra å laste på nytt

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    // Prøv å logge inn mot Supabase
    const { data, error } = await _supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Feil ved innlogging: " + error.message);
    } else {
      alert("Suksess! Du er nå logget inn.");
      console.log("Brukerdata:", data);
      lukkLoggInn(); // lukker
    }
  });
}
