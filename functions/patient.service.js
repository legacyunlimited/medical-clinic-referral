const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const admin = require('firebase-admin');
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

// Function to create a new patient
module.exports.create = async (args, context) => {
  try {
    const Patient = resolveSchema(args.base_version, 'Patient'); // Resolve the patient schema
    
    // Generate a unique six-digit random medical record number
    let medicalRecordNumber = await generateUniqueRandomMedicalRecordNumber();
    
    
    const doc = new Patient({
      // Required fields
      given: args.resource.given,
      family: args.resource.family,
      
      // Optional fields with default values or conditional inclusion
      gender: args.resource.gender || 'unknown', // Set a default value or handle it conditionally
      birthDate: args.resource.birthDate, 

      // Include the generated medical record number
      identifier: [
        {
          system: 'http://example.com/fhir/SearchParameter/Patient-mrn',
          value: medicalRecordNumber,
        },
      ],
    }).toJSON();

    // Save the patient document to Firestore with the unique medical record number
    const newPatientRef = await db.collection('patients').add(doc);

    return {
      id: newPatientRef.id,
      
      resource_version: '1', // Replace with the appropriate resource version
    };
  } catch (error) {
    throw error; // Handle the error appropriately
  }
};

// Function to generate a unique six-digit random medical record number
async function generateUniqueRandomMedicalRecordNumber() {
  while (true) {
    const medicalRecordNumber = generateRandomSixDigitNumber();
    
    // Check if the generated number is unique by querying Firestore
    const querySnapshot = await db
      .collection('patients')
      .where('identifier.system', '==', 'http://example.com/medical-record-number')
      .where('identifier.value', '==', medicalRecordNumber)
      .get();

    if (querySnapshot.empty) {
      // The generated number is unique, return it
      return medicalRecordNumber;
    }
  }
}

// Function to generate a random six-digit number
function generateRandomSixDigitNumber() {
  const min = 100000; // Minimum six-digit number
  const max = 999999; // Maximum six-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Function to read a patient by ID
module.exports.read = async (id) => {
  try {
    const patientRef = await db.collection('patients').doc(id).get();
    if (!patientRef.exists) {
      return null; // Patient not found
    }
    
    const patientData = patientRef.data();
    return {
      resourceType: 'Patient',
      id,
      ...patientData
    };
  } catch (error) {
    throw error; // Handle the error appropriately
  }
};

// Function to update a patient by ID
module.exports.update = async (id, updatedResource) => {
  try {
    const patientRef = db.collection('patients').doc(id);
    await patientRef.update(updatedResource);
    
    return {
      resourceType: 'Patient',
      id,
      ...updatedResource
    };
  } catch (error) {
    throw error; // Handle the error appropriately
  }
};

// Function to delete a patient by ID
module.exports.delete = async (id) => {
  try {
    await db.collection('patients').doc(id).delete();
    return true; // Successfully deleted
  } catch (error) {
    throw error; // Handle the error appropriately
  }
};
  
