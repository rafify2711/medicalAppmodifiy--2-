import express from "express";
import { checkContradiction, suggestSubstitutions, checkDrugDiseaseContradiction } from "./contradictions.js";

const router = express.Router();

router.get("/check", (req, res) => {
  const { drug1, drug2 } = req.query;
  if (!drug1 || !drug2) {
    return res.status(400).json({ error: "Both drug1 and drug2 are required" });
  }
  res.json({ result: checkContradiction(drug1, drug2) });
});

router.get("/substitutions", (req, res) => {
  const { drug } = req.query;
  if (!drug) {
    return res.status(400).json({ error: "Drug name is required" });
  }
  res.json({ result: suggestSubstitutions(drug) });
});

router.get("/disease-check", (req, res) => {
  const { drug, disease } = req.query;
  if (!drug || !disease) {
    return res.status(400).json({ error: "Drug and disease are required" });
  }
  res.json({ result: checkDrugDiseaseContradiction(drug, disease) });
});

export default router;
