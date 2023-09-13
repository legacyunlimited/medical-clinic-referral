const admin = require('firebase-admin');
const db = admin.firestore();

module.exports.create = async (args, context) => {
    const patientData = args.resource;
    const newPatientRef = await db.collection('patients').add(patientData);
    const newPatientId = newPatientRef.id;
    
    const response = {
        resourceType: 'Patient',
        id: newPatientId,
        ...patientData
    };
    
    return { resource: response };
};
