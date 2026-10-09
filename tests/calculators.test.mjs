// Characterization tests: they lock the CURRENT calculator behaviour (no formula was changed).
import test from "node:test";
import assert from "node:assert/strict";
import { parseLocalDate, addDays, calculateCycle, getCurrentPhase, analyzeRegularity } from "../src/utils/cycleCalculator.js";

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

test("parseLocalDate: valid, invalid and empty values", () => {
  assert.equal(ymd(parseLocalDate("2026-03-01")), "2026-03-01");
  assert.equal(parseLocalDate(""), null);
  assert.equal(parseLocalDate(null), null);
  assert.equal(parseLocalDate("not-a-date"), null);
});

test("calculateCycle crosses a leap-year February correctly (2024)", () => {
  const r = calculateCycle(parseLocalDate("2024-02-20"), 5, 28);
  assert.equal(ymd(r.nextPeriodStart), "2024-03-19");
  assert.equal(ymd(r.ovulation), "2024-03-05"); // next period - 14 days
  assert.equal(ymd(r.fertileStart), "2024-02-29"); // ovulation - 5
  assert.equal(ymd(r.fertileEnd), "2024-03-06"); // ovulation + 1
  assert.equal(ymd(r.nextPeriodEnd), "2024-03-23");
});

test("calculateCycle: short (21) and long (45) cycles keep ovulation 14 days before the next period", () => {
  for (const len of [21, 45]) {
    const lmp = parseLocalDate("2026-01-01");
    const r = calculateCycle(lmp, 4, len);
    assert.equal(Math.round((r.nextPeriodStart - r.ovulation) / 86400000), 14);
    assert.equal(Math.round((r.nextPeriodStart - lmp) / 86400000), len);
  }
});

test("addDays does not mutate its input", () => {
  const d = parseLocalDate("2026-01-31");
  addDays(d, 1);
  assert.equal(ymd(d), "2026-01-31");
});

test("getCurrentPhase: phases of a 28-day cycle and out-of-range input", () => {
  const lmp = parseLocalDate("2026-01-01");
  assert.equal(getCurrentPhase(lmp, 28, parseLocalDate("2026-01-01")).phase, "menstruation");
  assert.equal(getCurrentPhase(lmp, 28, parseLocalDate("2026-01-15")).phase, "ovulation");
  assert.equal(getCurrentPhase(lmp, 28, parseLocalDate("2026-01-20")).phase, "luteal");
  assert.equal(getCurrentPhase(lmp, 28, parseLocalDate("2026-01-29")).cycleDay, 1); // wraps to a new cycle
  assert.equal(getCurrentPhase(lmp, 28, parseLocalDate("2025-12-31")), null); // before the last period
  assert.equal(getCurrentPhase(null, 28), null);
  assert.equal(getCurrentPhase(lmp, NaN), null);
});

test("analyzeRegularity: regular, irregular and invalid inputs", () => {
  const d = (s) => parseLocalDate(s);
  const regular = analyzeRegularity([d("2026-01-01"), d("2026-01-29"), d("2026-02-26")]);
  assert.equal(regular.classification, "regular");
  assert.equal(regular.avg, 28);
  assert.equal(regular.flagsMedical, false);

  const irregular = analyzeRegularity([d("2026-01-01"), d("2026-01-20"), d("2026-02-25")]);
  assert.deepEqual(irregular.cycles, [19, 36]);
  assert.equal(irregular.classification, "more-variable");
  assert.equal(irregular.veryShort, true);
  assert.equal(irregular.veryLong, true);
  assert.equal(irregular.flagsMedical, true);

  assert.equal(analyzeRegularity([d("2026-01-01"), d("2026-01-29")]), null); // fewer than 3 dates
  assert.equal(analyzeRegularity([d("2026-01-01"), d("2026-01-29"), new Date("x")]), null); // invalid date ignored -> too few
  assert.equal(analyzeRegularity(null), null);
});

test("analyzeRegularity sorts unordered dates", () => {
  const d = (s) => parseLocalDate(s);
  const r = analyzeRegularity([d("2026-02-26"), d("2026-01-01"), d("2026-01-29")]);
  assert.deepEqual(r.cycles, [28, 28]);
});
