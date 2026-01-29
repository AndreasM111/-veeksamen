// --------------------------------------------------------
// KONFIGURASJON
// --------------------------------------------------------
const SUPABASE_URL = "https://tdyoicyhxpgauonfxuch.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeW9pY3loeHBnYXVvbmZ4dWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjU1OTIsImV4cCI6MjA3OTIwMTU5Mn0.e-DLsnfboe6X1O5adDtPoT8Hfdr1KKLr0H2S6jkEF8M";

// Initialiser Supabase
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// --------------------------------------------------------
// HENTE ELEMENTER FRA HTML
// --------------------------------------------------------
const loginBtn = document.getElementById("loginBtn");
const modal = document.getElementById("loginModal");
const lukkBtn = document.querySelector(".lukk-modal");
const loginSkjema = document.getElementById("loginSkjema");
const meldingEl = document.getElementById("loginMelding");

// Nye elementer for bytting av modus
const modalTittel = document.getElementById("modalTittel");
const submitBtn = document.getElementById("submitBtn");
const byttTekst = document.getElementById("byttTekst");
const byttModusLenke = document.getElementById("byttModusLenke");

// Variabel for å holde styr på om vi logger inn eller registrerer
let erLoginModus = true;

// --------------------------------------------------------
// SJEKK STATUS VED OPPSTART
// --------------------------------------------------------
async function sjekkStatus() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  oppdaterMeny(session);
}

function oppdaterMeny(session) {
  if (session) {
    loginBtn.textContent = "Logg ut";
  } else {
    loginBtn.textContent = "Logg inn";
  }
}

// --------------------------------------------------------
// LOGIKK FOR MODAL OG BYTTING AV MODUS
// --------------------------------------------------------

// Åpne/Lukke Logikk
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (loginBtn.textContent === "Logg ut") {
    const { error } = await sb.auth.signOut();
    if (!error) {
      alert("Du er nå logget ut.");
      window.location.reload();
    }
  } else {
    // Nullstill til "Logg inn" modus hver gang vi åpner
    settTilLoginModus();
    modal.style.display = "flex";
    meldingEl.textContent = "";
  }
});

lukkBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Funksjon for å bytte mellom Login og Registrering
byttModusLenke.addEventListener("click", (e) => {
  e.preventDefault();
  erLoginModus = !erLoginModus; // Bytt status (true/false)

  if (erLoginModus) {
    settTilLoginModus();
  } else {
    settTilRegistrerModus();
  }
});

function settTilLoginModus() {
  erLoginModus = true;
  modalTittel.textContent = "Logg inn";
  submitBtn.textContent = "Logg inn";
  byttTekst.textContent = "Har du ikke bruker?";
  byttModusLenke.textContent = "Registrer deg her";
  meldingEl.textContent = "";
}

function settTilRegistrerModus() {
  erLoginModus = false;
  modalTittel.textContent = "Ny bruker";
  submitBtn.textContent = "Registrer meg";
  byttTekst.textContent = "Har du allerede bruker?";
  byttModusLenke.textContent = "Logg inn her";
  meldingEl.textContent = "";
}

// --------------------------------------------------------
// LOGIN / REGISTRERING LOGIKK (SEND SKJEMA)
// --------------------------------------------------------
loginSkjema.addEventListener("submit", async (e) => {
  e.preventDefault();

  const epost = document.getElementById("loginEpost").value;
  const passord = document.getElementById("loginPassord").value;

  meldingEl.style.color = "#333";

  if (erLoginModus) {
    // --- LOGG INN ---
    meldingEl.textContent = "Logger inn...";
    const { data, error } = await sb.auth.signInWithPassword({
      email: epost,
      password: passord,
    });

    if (error) {
      meldingEl.textContent = "Feil: " + error.message;
      meldingEl.style.color = "red";
    } else {
      meldingEl.textContent = "Suksess! Velkommen tilbake.";
      meldingEl.style.color = "green";
      setTimeout(() => {
        modal.style.display = "none";
        oppdaterMeny(data.session);
        loginSkjema.reset();
      }, 1000);
    }
  } else {
    // --- REGISTRER NY BRUKER ---
    meldingEl.textContent = "Registrerer bruker...";
    const { data, error } = await sb.auth.signUp({
      email: epost,
      password: passord,
    });

    if (error) {
      meldingEl.textContent = "Feil ved registrering: " + error.message;
      meldingEl.style.color = "red";
    } else {
      // Suksess ved registrering
      meldingEl.textContent =
        "Konto opprettet! Sjekk e-posten din for bekreftelse.";
      meldingEl.style.color = "green";
      // Merk: Vi logger ikke inn automatisk her fordi e-posten må bekreftes først
      loginSkjema.reset();
    }
  }
});

sjekkStatus();

// --------------------------------------------------------
// KONTAKTSKJEMA LOGIKK (Send melding til Database)
// --------------------------------------------------------
const kontaktSkjema = document.getElementById("kontaktSkjema");

if (kontaktSkjema) {
  kontaktSkjema.addEventListener("submit", async (e) => {
    e.preventDefault(); // Hindrer siden i å laste på nytt

    const navn = document.getElementById("navn").value;
    const epostForm = document.getElementById("epost").value; // Endret variabelnavn for å ikke kræsje med login
    const melding = document.getElementById("melding").value;
    const knapp = kontaktSkjema.querySelector("button");

    // Endre knapptekst for å vise at noe skjer
    const orginalTekst = knapp.innerText;
    knapp.innerText = "Sender...";

    // Send til Supabase (Tabellnavn: 'messages')
    const { error } = await sb.from("messages").insert({
      navn: navn,
      epost: epostForm,
      melding: melding,
    });

    if (error) {
      alert("Noe gikk galt: " + error.message);
      knapp.innerText = orginalTekst;
    } else {
      alert("Takk! Meldingen din er sendt.");
      kontaktSkjema.reset(); // Tømmer skjemaet
      knapp.innerText = orginalTekst;
    }
  });
}
