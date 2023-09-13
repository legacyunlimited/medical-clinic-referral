const admin = require('firebase-admin');
const db = admin.firestore();

module.exports.create = async (args, context) => {
  const encounterData = args.resource;
  const newEncounterRef = await db.collection('encounters').add(encounterData);
  const newEncounterId = newEncounterRef.id;

  const response = {
    resourceType: 'Encounter',
    id: newEncounterId,
    ...encounterData
  };

  return { resource: response };
};
