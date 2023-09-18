module.exports = {
  profiles: {
    patient: {
    makeResource: (args, logger) => {
      const identifier = {
        name: 'identifier',
        type: 'token',
        fhirtype: 'token',
        xpath: 'patient.identifier',
        definition: 'http://hl7.org/fhir/SearchParameter/Patient-identifier',
        description: 'A patient identifier',
      };
  
      // Add a new search parameter for "medical record number"
      const medicalRecordNumber = {
        name: 'mrn', 
        type: 'token',
        fhirtype: 'token',
        xpath: 'patient.identifier', // Adjust the XPath as needed
        definition: 'http://example.com/fhir/SearchParameter/Patient-mrn', // Replace with the actual definition URL
        description: 'A medical record number for the patient', // Add a description
      };
  
      // Return the updated metadata
      return {
        ...args,
        base_version: '4.0.0', // Adjust the FHIR version if needed
        type: 'patient', // Replace with the resource type you are working with
        profile: {
          reference: 'http://hl7.org/fhir/Patient', // Replace with the appropriate profile reference
        },
        searchParams: [identifier, medicalRecordNumber], // Add the new search parameter here
        logger,
        };
      },
    },
  },
};