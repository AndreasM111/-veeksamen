// 1. DINE NYE SUPABASE-NØKLER
const SUPABASE_URL = "https://ydgngojuleapbtqhxztx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ25nb2p1bGVhcGJ0cWh4enR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MjU5MTcsImV4cCI6MjA4NDQwMTkxN30.4yM2LzMgZ2Imi4ArNgtABNF5fn9UW2F8YBsATB3QnI0";

// 2. Kobler til Supabase
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Finner skjemaet
const form = document.getElementById("kontaktSkjema");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stopper siden fra å laste på nytt

    const navn = document.getElementById("navn").value;
    const epost = document.getElementById("epost").value;
    const melding = document.getElementById("melding").value;

    // Sender til Supabase
    const { error } = await _supabase
      .from("meldinger")
      .insert({ navn: navn, epost: epost, melding: melding });

    if (error) {
      console.error(error);
      alert(
        "Feil! Sjekk at tabellen heter 'meldinger' (små bokstaver) og at RLS er AV i Supabase.",
      );
    } else {
      alert("Melding sendt! Vi snakkes.");
      form.reset(); // Tømmer feltene
    }
  });
}
