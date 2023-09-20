/* module.exports = {
  profiles: {
    Patient: {
    makeResource: (args, logger) => {
      const identifier = {
        name: 'identifier',
        type: 'token',
        fhirtype: 'token',
        xpath: 'Patient.identifier',
        definition: 'http://hl7.org/fhir/SearchParameter/Patient-identifier',
        description: 'A patient identifier',
      };
  
      // Add a new search parameter for "medical record number"
      const medicalRecordNumber = {
        name: 'mrn', 
        type: 'token',
        fhirtype: 'token',
        xpath: 'Patient.identifier', // Adjust the XPath as needed
        definition: 'http://example.com/fhir/SearchParameter/Patient-mrn', // Replace with the actual definition URL
        description: 'A medical record number for the patient', // Add a description
      };
  
      // Return the updated metadata
      return {
        ...args,
        base_version: '4_0_0', // Adjust the FHIR version if needed
        type: 'Patient', // Replace with the resource type you are working with
        profile: {
          reference: 'http://hl7.org/fhir/StructureDefinition/Patient', // Replace with the appropriate profile reference
        },
        searchParams: [identifier, medicalRecordNumber], // Add the new search parameter here
        logger,
        };
      },
    },
  },
}; */