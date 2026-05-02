// Logique pure du calculateur de cycle menstruel.
// Aucun appel réseau, aucun stockage. Toutes les dates sont locales pour
// éviter les décalages liés au fuseau horaire.

// Parse "YYYY-MM-DD" comme une date locale (et non UTC, ce que ferait `new Date(str)`).
export function parseLocalDate(str) {
  if (!str || typeof str !== "string") return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Estimations basées sur la durée moyenne du cycle et une phase lutéale fixée à 14 jours.
// Les vrais cycles varient — c'est explicitement signalé dans l'UI.
export function calculateCycle(lmp, periodDuration, cycleLength) {
  const nextPeriodStart = addDays(lmp, cycleLength);
  const nextPeriodEnd = addDays(nextPeriodStart, periodDuration - 1);
  const ovulation = addDays(nextPeriodStart, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);
  const followingPeriodStart = addDays(nextPeriodStart, cycleLength);
  return {
    nextPeriodStart,
    nextPeriodEnd,
    ovulation,
    fertileStart,
    fertileEnd,
    followingPeriodStart,
  };
}

// Position actuelle dans le cycle + phase probable.
// Heuristique : règles ≈ 5 premiers jours, ovulation ≈ jour cycle-14, lutéale après.
// `lmp` Date locale, `cycleLength` jours, `today` (optionnel) Date locale.
export function getCurrentPhase(lmp, cycleLength, today = new Date()) {
  if (!lmp || !Number.isFinite(cycleLength)) return null;
  const start = new Date(lmp);
  start.setHours(0, 0, 0, 0);
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  const daysSince = Math.floor((now - start) / 86400000);
  if (daysSince < 0) return null;
  const cycleDay = (daysSince % cycleLength) + 1;
  const ovulationDay = Math.max(1, cycleLength - 14);
  const fertileStart = Math.max(1, ovulationDay - 5);
  const fertileEnd = Math.min(cycleLength, ovulationDay + 1);
  const periodEnd = Math.min(5, Math.floor(cycleLength / 5));

  let phase;
  if (cycleDay <= periodEnd) phase = "menstruation";
  else if (cycleDay < fertileStart) phase = "follicular";
  else if (cycleDay <= fertileEnd) phase = "ovulation";
  else phase = "luteal";

  return { cycleDay, phase, ovulationDay, fertileStart, fertileEnd, periodEnd, cycleLength };
}

// Analyse de régularité à partir de N dates (3 à 6) de début de règles.
// Retourne moyenne, min, max, variabilité, classification éducative.
export function analyzeRegularity(dates) {
  if (!Array.isArray(dates) || dates.length < 3) return null;
  const valid = dates.filter((d) => d instanceof Date && !isNaN(d.getTime()));
  if (valid.length < 3) return null;
  const sorted = [...valid].sort((a, b) => a - b);

  const cycles = [];
  for (let i = 1; i < sorted.length; i++) {
    const days = Math.round((sorted[i] - sorted[i - 1]) / 86400000);
    cycles.push(days);
  }
  if (cycles.length === 0) return null;

  const avg = Math.round(cycles.reduce((s, n) => s + n, 0) / cycles.length);
  const shortest = Math.min(...cycles);
  const longest = Math.max(...cycles);
  const variability = longest - shortest;

  let classification;
  if (variability <= 7) classification = "regular";
  else if (variability <= 14) classification = "slightly-variable";
  else classification = "more-variable";

  const veryShort = shortest < 21;
  const veryLong = longest > 35;
  const flagsMedical = veryShort || veryLong || classification === "more-variable";

  return {
    cycles,
    sortedDates: sorted,
    avg,
    shortest,
    longest,
    variability,
    classification,
    veryShort,
    veryLong,
    flagsMedical,
  };
}
