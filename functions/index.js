const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { initialize, loggers, constants } = require('@asymmetrik/node-fhir-server-core');
const { onRequest } = require('firebase-functions/v2/https');

// Add middleware to authenticate requests
const { VERSIONS } = constants;

initializeApp();

// Import and load environment variables
require('dotenv').config();


// Import patientService after Firebase initialization
const patientService = require('./patient.service.js');


// Initialize the FHIR server
const fhirServer = initialize({
  profiles: {
    Patient: {
      service: './patient.service.js',
      versions: [VERSIONS['4_0_0']],
      /* metadata: './patient.metadata.js' */
    },
    encounter: {
      service: './encounter.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    organization: {
      service: './organization.service.js',
      versions: [VERSIONS['4_0_0']],
    },
  },
});

exports.createPatient = onRequest(async (req, res) => {
  try {
    const patientData = req.body; // Assuming patient data is sent in the request body

 // Use the FHIR server's create function with the provided args
 const createdPatient = await patientService.create({
  base_version: '4_0_0', // Replace with your desired FHIR version
  resource: patientData,
});

res.status(201).json(createdPatient);
} catch (error) {
console.error(error);
res.status(500).send('Error creating Patient resource.');
}
});


  exports.getPatient = onRequest(async (req, res) => {
    try {
      const patientId = req.params.patientId; // Assuming you pass the patient ID in the request URL
  
      // Use the FHIR server to retrieve the Patient resource by ID
      const patient = await fhirServer.read({ resourceType: 'Patient', id: patientId });
  
      if (patient) {
        res.status(200).json(patient);
      } else {
        res.status(404).send('Patient not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving Patient resource.');
    }
  });

  exports.updatePatient = onRequest(async (req, res) => {
    try {
      const patientId = req.params.patientId; // Assuming you pass the patient ID in the request URL
      const updatedPatientData = req.body; // Updated patient data in the request body
  
      // Use the FHIR server to update the Patient resource by ID
      const updatedPatient = await fhirServer.update({ resourceType: 'Patient', id: patientId, resource: updatedPatientData });
  
      if (updatedPatient) {
        res.status(200).json(updatedPatient);
      } else {
        res.status(404).send('Patient not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating Patient resource.');
    }
  });

  exports.deletePatient = onRequest(async (req, res) => {
    try {
      const patientId = req.params.patientId; // Assuming you pass the patient ID in the request URL
  
      // Use the FHIR server to delete the Patient resource by ID
      const deletedPatient = await fhirServer.delete({ resourceType: 'Patient', id: patientId });
  
      if (deletedPatient) {
        res.status(204).send(); // Successfully deleted, no content to return
      } else {
        res.status(404).send('Patient not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting Patient resource.');
    }
  });

// Define a cloud function for creating Organization resources
exports.createOrganization = onRequest(async (req, res) => {
  try {
    const organizationData = req.body; // Assuming organization data is sent in the request body

    // Use the FHIR server to create an Organization resource
    const createdOrganization = await fhirServer.create({ resourceType: 'Organization', resource: organizationData });

    res.status(201).json(createdOrganization);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating Organization resource.');
  }
});

// Search for patients using FHIR
exports.customSearch = onRequest(async (req, res) => {
  try {
    const searchQuery = req.query.q; // Get search query from request

    // Use the FHIR server to search for patients
    const searchResults = await fhirServer.search({ resourceType: 'Patient', searchParams: { name: searchQuery } });

    res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error performing search.');
  }
});

// Store survey responses in Firestore
exports.submitSurvey = onRequest(async (req, res) => {
  try {
    const surveyData = req.body; // Assuming survey data is sent in the request body

    // Store survey data in Firestore
    await db.collection('surveys').add(surveyData);

    res.status(200).send('Survey submitted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting survey.');
  }
});

// Perform referral logic using FHIR and Firestore
exports.performReferral = onRequest(async (req, res) => {
  try {
    const surveyData = req.body; // Assuming survey data is sent in the request body
    const condition = surveyData.condition; // Assuming survey captures condition

    // Use the FHIR server to search for clinics based on the condition
    const clinics = await fhirServer.search({ resourceType: 'Organization', searchParams: { specialty: condition } });

    // Transform FHIR clinic data and store it in Firestore
    const referralList = clinics.map((clinic) => {
      return {
        name: clinic.name,
        specialty: clinic.specialty,
        // Add other fields as needed
      };
    });

    // Store referral data in Firestore
    await db.collection('referrals').add({ condition, referrals: referralList });

    res.status(200).json(referralList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error performing referral.');
  }
});