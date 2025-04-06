import readline from 'readline';

export { checkContradiction, suggestSubstitutions, checkDrugDiseaseContradiction };

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Source: Drugs.com
// Expanded database of active ingredients and their contradictions
const ingredientDatabase = {
  Warfarin: ["Aspirin", "Ibuprofen", "Omeprazole", "Simvastatin", "Fluconazole", "Vitamin K"], 
  Metformin: ["Iodinated contrast dye", "Cimetidine", "Alcohol", "Furosemide", "Corticosteroids", "Beta-blockers"], 
  Lisinopril: ["Potassium supplements", "Ibuprofen", "Lithium", "Aliskiren", "Hydrochlorothiazide", "Spironolactone"], 
  Simvastatin: ["Grapefruit juice", "Erythromycin", "Cyclosporine", "Gemfibrozil", "Verapamil", "Warfarin"], 
  Paracetamol: ["Alcohol", "Isoniazid", "Warfarin", "Carbamazepine", "Phenytoin", "Cholestyramine"], 
  Digoxin: ["Furosemide", "Quinidine", "Calcium supplements", "Amiodarone", "Verapamil", "Erythromycin"], 
  Fluoxetine: ["Phenelzine", "Tramadol", "Warfarin", "Sumatriptan", "Ibuprofen", "Lithium"], 
  Amlodipine: ["Simvastatin", "Grapefruit juice", "Metoprolol", "Diltiazem", "Cyclosporine", "Rifampin"], 
  Prednisone: ["Ibuprofen", "Warfarin", "Furosemide", "Live vaccines", "Metformin", "Cyclosporine"], 
  Ciprofloxacin: ["Calcium supplements", "Iron supplements", "Warfarin", "Theophylline", "Tizanidine", "Ibuprofen"], 
  Lithium: ["Hydrochlorothiazide", "Ibuprofen", "Lisinopril", "Fluoxetine", "Caffeine", "Sodium-restricted diet"], 
  Alprazolam: ["Alcohol", "Codeine", "Fluoxetine", "Diphenhydramine", "Ketoconazole", "Grapefruit juice"], 
  Ibuprofen: ["Warfarin", "Lisinopril", "Fluoxetine", "Prednisone", "Ciprofloxacin", "Lithium"], 
  Aspirin: ["Warfarin", "Ibuprofen", "Fluoxetine", "Corticosteroids", "Methotrexate", "Alcohol"], 
  Omeprazole: ["Warfarin", "Clopidogrel", "Ketoconazole", "Diazepam", "Digoxin", "Iron supplements"], 
  Clopidogrel: ["Omeprazole", "Warfarin", "Aspirin", "Fluoxetine", "NSAIDs", "Proton pump inhibitors"], 
  Atorvastatin: ["Grapefruit juice", "Cyclosporine", "Erythromycin", "Gemfibrozil", "Verapamil", "Warfarin"], 
  Diazepam: ["Alcohol", "Omeprazole", "Fluoxetine", "Ketoconazole", "Cimetidine", "Opioids"], 
  Methotrexate: ["Aspirin", "NSAIDs", "Penicillin", "Probenecid", "Sulfonamides", "Alcohol"], 
  Phenytoin: ["Paracetamol", "Warfarin", "Fluoxetine", "Cimetidine", "Alcohol", "Oral contraceptives"], 
  Theophylline: ["Ciprofloxacin", "Erythromycin", "Cimetidine", "Fluoxetine", "Carbamazepine", "Alcohol"], 
  Codeine: ["Alcohol", "Alprazolam", "Fluoxetine", "Tramadol", "Benzodiazepines", "Antihistamines"], 
  Sertraline: ["MAO Inhibitors", "Tramadol", "Warfarin", "NSAIDs", "Triptans", "Lithium"], 
  Venlafaxine: ["MAO Inhibitors", "Tramadol", "Warfarin", "NSAIDs", "Triptans", "Lithium"], 
  Tramadol: ["Sertraline", "Venlafaxine", "Fluoxetine", "MAO Inhibitors", "Alcohol", "Benzodiazepines"], 
  Metoprolol: ["Amlodipine", "Verapamil", "Diltiazem", "Clonidine", "Fluoxetine", "Digoxin"], 
  Furosemide: ["Digoxin", "Lithium", "Corticosteroids", "NSAIDs", "Aminoglycosides", "ACE Inhibitors"], 
  Hydrochlorothiazide: ["Lithium", "Digoxin", "NSAIDs", "Corticosteroids", "ACE Inhibitors", "Calcium supplements"], 
  Spironolactone: ["Potassium supplements", "ACE Inhibitors", "Lithium", "Digoxin", "NSAIDs", "Corticosteroids"], 
  Cimetidine: ["Metformin", "Diazepam", "Phenytoin", "Theophylline", "Warfarin", "Carbamazepine"], 
  Carbamazepine: ["Paracetamol", "Fluoxetine", "Theophylline", "Warfarin", "Oral contraceptives", "Cimetidine"], 
  Erythromycin: ["Simvastatin", "Atorvastatin", "Theophylline", "Warfarin", "Carbamazepine", "Digoxin"], 
  Ketoconazole: ["Alprazolam", "Omeprazole", "Simvastatin", "Atorvastatin", "Warfarin", "Diazepam"], 
  Rifampin: ["Amlodipine", "Warfarin", "Oral contraceptives", "Fluoxetine", "Theophylline", "Carbamazepine"], 
  Amoxicillin: ["Methotrexate", "Oral contraceptives", "Warfarin", "Probenecid", "Allopurinol", "Tetracyclines"], 
  Azithromycin: ["Warfarin", "Digoxin", "Theophylline", "Cyclosporine", "Statins", "Antacids"], 
  Doxycycline: ["Calcium supplements", "Iron supplements", "Antacids", "Warfarin", "Penicillin", "Oral contraceptives"], 
  Gabapentin: ["Opioids", "Alcohol", "Antihistamines", "Benzodiazepines", "CNS depressants", "Omeprazole"], 
  Levothyroxine: ["Calcium supplements", "Iron supplements", "Antacids", "Soy products", "Warfarin", "Proton pump inhibitors"], 
  Losartan: ["Potassium supplements", "NSAIDs", "Lithium", "Diuretics", "ACE Inhibitors", "Aliskiren"], 
  Pantoprazole: ["Warfarin", "Methotrexate", "Digoxin", "Iron supplements", "Ketoconazole", "Atazanavir"], 
  Ranitidine: ["Warfarin", "Ketoconazole", "Atazanavir", "Cimetidine", "Digoxin", "Procainamide"], 
  Rosuvastatin: ["Grapefruit juice", "Cyclosporine", "Gemfibrozil", "Warfarin", "Erythromycin", "Antacids"], 
  Zolpidem: ["Alcohol", "Opioids", "Benzodiazepines", "Antihistamines", "CNS depressants", "Ketoconazole"], 
  Amiodarone: ["Simvastatin", "Warfarin", "Digoxin", "Beta-blockers", "Calcium channel blockers", "Grapefruit juice"], 
  Atenolol: ["Calcium channel blockers", "Digoxin", "Insulin", "NSAIDs", "Clonidine", "Diphenhydramine"], 
  Baclofen: ["Alcohol", "Antihistamines", "Benzodiazepines", "Opioids", "CNS depressants", "Muscle relaxants"], 
  Celecoxib: ["Aspirin", "Warfarin", "Lithium", "ACE inhibitors", "Diuretics", "Corticosteroids"], 
  Clonidine: ["Beta-blockers", "Calcium channel blockers", "Digoxin", "Tricyclic antidepressants", "Alcohol", "Sedatives"], 
  Cyclobenzaprine: ["Alcohol", "Benzodiazepines", "Opioids", "CNS depressants", "Antihistamines", "Muscle relaxants"], 
  Diltiazem: ["Simvastatin", "Warfarin", "Digoxin", "Beta-blockers", "Amiodarone", "Grapefruit juice"], 
  Duloxetine: ["MAO inhibitors", "Tramadol", "Warfarin", "NSAIDs", "Triptans", "Lithium"], 
  Escitalopram: ["MAO inhibitors", "Tramadol", "Warfarin", "NSAIDs", "Triptans", "Lithium"], 
  Esomeprazole: ["Warfarin", "Clopidogrel", "Ketoconazole", "Diazepam", "Digoxin", "Iron supplements"], 
  Famotidine: ["Warfarin", "Ketoconazole", "Atazanavir", "Cimetidine", "Digoxin", "Procainamide"], 
  Fluconazole: ["Warfarin", "Simvastatin", "Phenytoin", "Cyclosporine", "Carbamazepine", "Theophylline"], 
  Folicacid: ["Methotrexate", "Phenytoin", "Sulfonamides", "Trimethoprim", "Anticonvulsants", "Chemotherapy drugs"], 
  Glimepiride: ["Beta-blockers", "Alcohol", "Corticosteroids", "Thiazide diuretics", "NSAIDs", "Sulfonamides"], 
  Hydroxyzine: ["Alcohol", "Benzodiazepines", "Opioids", "CNS depressants", "Antihistamines", "Muscle relaxants"], 
  Insulin: ["Beta-blockers", "Alcohol", "Corticosteroids", "Thiazide diuretics", "NSAIDs", "Sulfonamides"], 
  Isosorbide: ["Nitroglycerin", "Sildenafil", "Tadalafil", "Vardenafil", "Alcohol", "Antihypertensives"], 
  Lamotrigine: ["Valproate", "Carbamazepine", "Phenytoin", "Oral contraceptives", "Rifampin", "Paracetamol"], 
  Levofloxacin: ["Calcium supplements", "Iron supplements", "Antacids", "Warfarin", "Theophylline", "NSAIDs"], 
  Loratadine: ["Alcohol", "Benzodiazepines", "Opioids", "CNS depressants", "Antihistamines", "Muscle relaxants"], 
  Meloxicam: ["Aspirin", "Warfarin", "Lithium", "ACE inhibitors", "Diuretics", "Corticosteroids"], 
  Montelukast: ["Phenobarbital", "Rifampin", "Carbamazepine", "Phenytoin", "Oral contraceptives", "Warfarin"], 
  Nifedipine: ["Simvastatin", "Warfarin", "Digoxin", "Beta-blockers", "Amiodarone", "Grapefruit juice"], 
  Olanzapine: ["Alcohol", "Benzodiazepines", "Opioids", "CNS depressants", "Antihistamines", "Muscle relaxants"], 
  Pregabalin: ["Alcohol", "Benzodiazepines", "Opioids", "CNS depressants", "Antihistamines", "Muscle relaxants"], 
  Quetiapine: ["Alcohol", "Benzodiazepines", "Opioids", "CNS depressants", "Antihistamines", "Muscle relaxants"], 
  Ranolazine: ["Simvastatin", "Warfarin", "Digoxin", "Beta-blockers", "Amiodarone", "Grapefruit juice"], 
  Sildenafil: ["Nitroglycerin", "Isosorbide", "Alpha-blockers", "Antihypertensives", "Alcohol", "Rifampin"], 
  Tamsulosin: ["Alpha-blockers", "Antihypertensives", "Nitroglycerin", "Sildenafil", "Alcohol", "Rifampin"], 
  Topiramate: ["Valproate", "Carbamazepine", "Phenytoin", "Oral contraceptives", "Rifampin", "Paracetamol"], 
  Valproate: ["Lamotrigine", "Carbamazepine", "Phenytoin", "Oral contraceptives", "Rifampin", "Paracetamol"], 
};

//Source: Clinical Pharmacology
// Database of drug substitutions
const substitutionDatabase = {
  Warfarin: ["Clopidogrel", "Dabigatran", "Rivaroxaban"], 
  Aspirin: ["Clopidogrel", "Ticagrelor", "Prasugrel"], 
  Ibuprofen: ["Acetaminophen", "Naproxen", "Celecoxib"], 
  Simvastatin: ["Atorvastatin", "Rosuvastatin", "Pravastatin"], 
  Fluoxetine: ["Sertraline", "Escitalopram", "Venlafaxine"], 
  Metformin: ["Sitagliptin", "Pioglitazone", "Glimepiride"], 
  Lisinopril: ["Losartan", "Valsartan", "Candesartan"], 
  Omeprazole: ["Pantoprazole", "Esomeprazole", "Lansoprazole"], 
  Ciprofloxacin: ["Levofloxacin", "Moxifloxacin", "Amoxicillin"], 
  Prednisone: ["Dexamethasone", "Methylprednisolone", "Hydrocortisone"], 
  Erythromycin: ["Azithromycin", "Clarithromycin", "Doxycycline"], 
  Paracetamol: ["Ibuprofen", "Naproxen", "Aspirin"], 
  Diazepam: ["Alprazolam", "Lorazepam", "Clonazepam"], 
  Atorvastatin: ["Rosuvastatin", "Simvastatin", "Pravastatin"], 
  Amlodipine: ["Nifedipine", "Felodipine", "Diltiazem"], 
  Furosemide: ["Hydrochlorothiazide", "Bumetanide", "Torsemide"], 
  Hydrochlorothiazide: ["Chlorthalidone", "Indapamide", "Metolazone"], 
  Spironolactone: ["Eplerenone", "Amiloride", "Triamterene"], 
  Gabapentin: ["Pregabalin", "Carbamazepine", "Lamotrigine"], 
  Levothyroxine: ["Liothyronine", "Desiccated thyroid", "Levothyroxine sodium"], 
  Losartan: ["Valsartan", "Irbesartan", "Telmisartan"], 
  Pantoprazole: ["Esomeprazole", "Lansoprazole", "Rabeprazole"], 
  Ranitidine: ["Famotidine", "Cimetidine", "Nizatidine"], 
  Rosuvastatin: ["Atorvastatin", "Simvastatin", "Pravastatin"], 
  Zolpidem: ["Eszopiclone", "Zaleplon", "Ramelteon"], 
  Tramadol: ["Codeine", "Morphine", "Oxycodone"], 
  Sertraline: ["Fluoxetine", "Paroxetine", "Citalopram"], 
  Venlafaxine: ["Duloxetine", "Desvenlafaxine", "Milnacipran"], 
  Alprazolam: ["Lorazepam", "Clonazepam", "Diazepam"], 
  Clonazepam: ["Alprazolam", "Lorazepam", "Diazepam"], 
  Lorazepam: ["Alprazolam", "Clonazepam", "Diazepam"], 
  Codeine: ["Tramadol", "Morphine", "Oxycodone"], 
  Morphine: ["Hydromorphone", "Oxycodone", "Fentanyl"], 
  Oxycodone: ["Hydromorphone", "Morphine", "Fentanyl"], 
  Fentanyl: ["Hydromorphone", "Morphine", "Oxycodone"], 
  Hydromorphone: ["Morphine", "Oxycodone", "Fentanyl"], 
  Amoxicillin: ["Cefalexin", "Cefuroxime", "Ciprofloxacin"], 
  Azithromycin: ["Clarithromycin", "Erythromycin", "Doxycycline"], 
  Cefalexin: ["Amoxicillin", "Cefuroxime", "Ciprofloxacin"], 
  Cefuroxime: ["Amoxicillin", "Cefalexin", "Ciprofloxacin"], 
  Doxycycline: ["Minocycline", "Tetracycline", "Azithromycin"], 
  Minocycline: ["Doxycycline", "Tetracycline", "Azithromycin"], 
  Tetracycline: ["Doxycycline", "Minocycline", "Azithromycin"], 
  Clindamycin: ["Erythromycin", "Azithromycin", "Doxycycline"], 
  Erythromycin: ["Azithromycin", "Clarithromycin", "Doxycycline"], 
  Clarithromycin: ["Azithromycin", "Erythromycin", "Doxycycline"], 
  Gentamicin: ["Amikacin", "Tobramycin", "Ciprofloxacin"], 
  Amikacin: ["Gentamicin", "Tobramycin", "Ciprofloxacin"], 
  Tobramycin: ["Gentamicin", "Amikacin", "Ciprofloxacin"], 
  Vancomycin: ["Linezolid", "Daptomycin", "Teicoplanin"], 
  Linezolid: ["Vancomycin", "Daptomycin", "Teicoplanin"], 
  Daptomycin: ["Vancomycin", "Linezolid", "Teicoplanin"], 
  Teicoplanin: ["Vancomycin", "Linezolid", "Daptomycin"], 
  Fluconazole: ["Itraconazole", "Voriconazole", "Posaconazole"], 
  Itraconazole: ["Fluconazole", "Voriconazole", "Posaconazole"], 
  Voriconazole: ["Fluconazole", "Itraconazole", "Posaconazole"], 
  Posaconazole: ["Fluconazole", "Itraconazole", "Voriconazole"], 
};

// Source: Medscape
// Database of drug-disease contradictions
const diseaseContradictions = {
  "Severe kidney disease": ["Metformin", "Ibuprofen", "Naproxen", "Gentamicin"], 
  "Liver disease": ["Paracetamol", "Statins", "Fluconazole", "Methotrexate"], 
  "Heart failure": ["NSAIDs", "Thiazolidinediones", "Diltiazem", "Verapamil"], 
  "Peptic ulcer disease": ["Aspirin", "Ibuprofen", "Naproxen", "Corticosteroids"], 
  "Asthma": ["Beta-blockers", "Aspirin", "NSAIDs"], 
  "Diabetes": ["Corticosteroids", "Thiazide diuretics", "Beta-blockers"], 
  "Pregnancy": ["Warfarin", "ACE inhibitors", "Statins", "Isotretinoin"], 
  "Hypertension": ["Decongestants", "NSAIDs", "Corticosteroids"], 
  "Chronic obstructive pulmonary disease (COPD)": ["Beta-blockers", "Sedatives", "Opioids"], 
  "Glaucoma": ["Anticholinergics", "Corticosteroids", "Topiramate"], 
  "Epilepsy": ["Tramadol", "Bupropion", "Fluoroquinolones"], 
  "Hyperthyroidism": ["Iodine", "Amiodarone", "Lithium"], 
  "Hypothyroidism": ["Calcium supplements", "Iron supplements", "Soy products"], 
  "Osteoporosis": ["Corticosteroids", "Proton pump inhibitors", "Anticonvulsants"], 
  "Gout": ["Diuretics", "Aspirin", "Nicotinic acid"], 
  "HIV/AIDS": ["Rifampin", "St. John's Wort", "Efavirenz"], 
  "Tuberculosis": ["Rifampin", "Isoniazid", "Pyrazinamide"], 
  "Rheumatoid arthritis": ["Corticosteroids", "NSAIDs", "Methotrexate"], 
  "Multiple sclerosis": ["Interferon beta", "Natalizumab", "Fingolimod"], 
  "Parkinson's disease": ["Antipsychotics", "Metoclopramide", "Reserpine"], 
  "Schizophrenia": ["Antidepressants", "Stimulants", "Dopamine agonists"], 
  "Bipolar disorder": ["Antidepressants", "Stimulants", "Corticosteroids"], 
  "Migraine": ["Vasodilators", "Oral contraceptives", "Nitroglycerin"], 
  "Chronic pain": ["Opioids", "Benzodiazepines", "Muscle relaxants"], 
  "Insomnia": ["Caffeine", "Stimulants", "Decongestants"], 
  "Anxiety": ["Caffeine", "Stimulants", "Decongestants"], 
  "Depression": ["Alcohol", "St. John's Wort", "MAO inhibitors"], 
  "Allergic rhinitis": ["Antihistamines", "Decongestants", "Corticosteroids"], 
  "Psoriasis": ["Beta-blockers", "Lithium", "Antimalarials"], 
  "Eczema": ["Corticosteroids", "Antihistamines", "Immunosuppressants"], 
  "Chronic hepatitis": ["Alcohol", "Methotrexate", "Isoniazid"], 
  "Cirrhosis": ["Alcohol", "Acetaminophen", "NSAIDs"], 
  "Diverticulitis": ["NSAIDs", "Opioids", "Corticosteroids"], 
  "Endometriosis": ["Estrogen", "Progestin", "Danazol"], 
  "Fibromyalgia": ["Opioids", "Benzodiazepines", "Muscle relaxants"], 
  "Gastroesophageal reflux disease (GERD)": ["Caffeine", "Alcohol", "Chocolate"], 
  "Hemophilia": ["Aspirin", "Ibuprofen", "Naproxen"], 
  "Hyperlipidemia": ["Statins", "Fibrates", "Niacin"], 
  "Hypokalemia": ["Diuretics", "Laxatives", "Corticosteroids"], 
  "Irritable bowel syndrome (IBS)": ["Caffeine", "Alcohol", "Dairy products"], 
  "Lupus": ["NSAIDs", "Corticosteroids", "Antimalarials"], 
  "Myasthenia gravis": ["Aminoglycosides", "Quinine", "Magnesium"], 
  "Narcolepsy": ["Stimulants", "Antidepressants", "Sedatives"], 
  "Obesity": ["Corticosteroids", "Antidepressants", "Antipsychotics"], 
  "Osteoarthritis": ["NSAIDs", "Corticosteroids", "Opioids"], 
  "Pancreatitis": ["Alcohol", "Gallstones", "Triglycerides"], 
  "Polycystic ovary syndrome (PCOS)": ["Estrogen", "Progestin", "Metformin"], 
  "Prostate cancer": ["Testosterone", "Estrogen", "Androgen inhibitors"], 
  "Psoriatic arthritis": ["NSAIDs", "Corticosteroids", "Methotrexate"], 
  "Restless legs syndrome": ["Antidepressants", "Antipsychotics", "Caffeine"], 
  "Rheumatic fever": ["Aspirin", "Corticosteroids", "Penicillin"], 
  "Sarcoidosis": ["Corticosteroids", "Immunosuppressants", "Antimalarials"], 
  "Sickle cell anemia": ["NSAIDs", "Opioids", "Hydroxyurea"], 
  "Sjogren's syndrome": ["Anticholinergics", "Antihistamines", "Corticosteroids"], 
  "Systemic sclerosis": ["Corticosteroids", "Immunosuppressants", "Calcium channel blockers"], 
  "Ulcerative colitis": ["NSAIDs", "Corticosteroids", "Immunosuppressants"], 
  "Vasculitis": ["Corticosteroids", "Immunosuppressants", "Antimalarials"], 
};

// Function to check for contradictions
function checkContradiction(ingredient1, ingredient2) {
  if (!ingredientDatabase[ingredient1] || !ingredientDatabase[ingredient2]) {
    return `✅ **No Contradiction Found**: ${ingredient1} and ${ingredient2} are safe to use together (one or both ingredients are not in the database).`;
  }

  if (ingredientDatabase[ingredient1].includes(ingredient2)) {
    return `⚠️ **Contradiction Found**: ${ingredient1} and ${ingredient2} should not be taken together.`;
  } else if (ingredientDatabase[ingredient2].includes(ingredient1)) {
    return `⚠️ **Contradiction Found**: ${ingredient2} and ${ingredient1} should not be taken together.`;
  } else {
    return `✅ **No Contradiction Found**: ${ingredient1} and ${ingredient2} are safe to use together.`;
  }
}

// Function to suggest drug substitutions
 function suggestSubstitutions(ingredient) {
  if (!substitutionDatabase[ingredient]) {
    return `❌ **No Substitutions Found for ${ingredient}**: No alternatives are available for this drug.`;
  } else {
    return `💡 **Substitutions for ${ingredient}**: ${substitutionDatabase[ingredient].join(", ")}`;
  }
}

// Function to check drug-disease contradictions
 function checkDrugDiseaseContradiction(drug, disease) {
  if (!diseaseContradictions[disease]) {
    return `❌ **Invalid Input**: The disease "${disease}" is not in the database.`;
  }

  if (diseaseContradictions[disease].includes(drug)) {
    return `⚠️ **Contradiction Found**: ${drug} should not be used in patients with ${disease}.`;
  } else {
    return `✅ **No Contradiction Found**: ${drug} is safe to use in patients with ${disease}.`;
  }
}

// Function to display all contradictions for a given ingredient
function displayContradictions(ingredient) {
  if (!ingredientDatabase[ingredient]) {
    return `❌ **Invalid Input**: ${ingredient} is not in the database.`;
  }

  if (ingredientDatabase[ingredient].length === 0) {
    return `ℹ️ **No Contradictions Found**: ${ingredient} has no known contradictions.`;
  } else {
    return `📋 **Contradictions for ${ingredient}**: ${ingredientDatabase[ingredient].join(", ")}`;
  }
}

// Function to prompt user for input
function promptUser() {
  rl.question('Enter a command (e.g., "check drug contradiction", "list", "disease-drug contradiction", or "exit"): ', (command) => {
    if (command.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    if (command.toLowerCase() === "check-disease") {
      rl.question('Enter the drug name: ', (drug) => {
        rl.question('Enter the medical condition: ', (disease) => {
          // Normalize input
          drug = drug.charAt(0).toUpperCase() + drug.slice(1).toLowerCase();
          disease = disease.charAt(0).toUpperCase() + disease.slice(1).toLowerCase();

          // Check for drug-disease contradiction
          const result = checkDrugDiseaseContradiction(drug, disease);
          console.log(result);

          // Repeat the prompt
          promptUser();
        });
      });
    } else if (command.toLowerCase() === "check") {
      rl.question('Enter the first active ingredient: ', (ingredient1) => {
        rl.question('Enter the second active ingredient (or type "list" to see contradictions for the first ingredient): ', (ingredient2) => {
          // Normalize input
          ingredient1 = ingredient1.charAt(0).toUpperCase() + ingredient1.slice(1).toLowerCase();

          if (ingredient2.toLowerCase() === "list") {
            // Display all contradictions for the first ingredient
            const result = displayContradictions(ingredient1);
            console.log(result);
          } else {
            ingredient2 = ingredient2.charAt(0).toUpperCase() + ingredient2.slice(1).toLowerCase();

            // Check for contradictions
            const result = checkContradiction(ingredient1, ingredient2);
            console.log(result);

            // If a contradiction is found, suggest substitutions
            if (result.includes("⚠️")) {
              console.log(suggestSubstitutions(ingredient1));
              console.log(suggestSubstitutions(ingredient2));
            }
          }

          // Repeat the prompt
          promptUser();
        });
      });
    } else if (command.toLowerCase() === "list") {
      rl.question('Enter the drug name to list its contradictions: ', (drug) => {
        drug = drug.charAt(0).toUpperCase() + drug.slice(1).toLowerCase();
        console.log(displayContradictions(drug));
        promptUser();
      });
    } else {
      console.log('❌ **Invalid Command**: Please enter a valid command (e.g., "check", "list", "check-disease", or "exit").');
      promptUser();
    }
  });
}

// Start the program
console.log("Welcome to the Drug Contradiction Checker!");
promptUser();