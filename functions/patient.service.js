const admin = require('firebase-admin');
const db = admin.firestore();

// Function to create a new patient
module.exports.create = async (resource) => {
  try {
    const newPatientRef = await db.collection('patients').add(resource);
    const newPatientId = newPatientRef.id;
    
    const response = {
      resourceType: 'Patient',
      id: newPatientId,
      ...resource
    };
    
    return response;
  } catch (error) {
    throw error; // Handle the error appropriately
  }
};

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
