const admin = require('firebase-admin');
const db = admin.firestore();

module.exports.create = async (args, context) => {
  const organizationData = args.resource;

  try {
    // Store organization data in Firestore
    const newOrganizationRef = await db.collection('organizations').add(organizationData);
    const newOrganizationId = newOrganizationRef.id;

    const response = {
      resourceType: 'Organization',
      id: newOrganizationId,
      ...organizationData,
    };

    return { resource: response };
  } catch (error) {
    console.error(error);
    throw new Error('Error creating Organization resource.');
  }
};
