'use strict'

const awsUtils = require('aws-utils');
const AWS = awsUtils.AWS;

const kms = new AWS.KMS();
const dynamodb = awsUtils.ddb;

const STACK_NAME = 'credentials';
const STACK_RESOURCES = [
    'credentialsKey',
    'credentialsTable'
];

module.exports = {
    read: async function(credentialName) {
        let resources = await awsUtils.resources(STACK_NAME, STACK_RESOURCES);

        const readParams = {
            name: credentialName
        };
        let readValue = await dynamodb.read(resources.credentialsTable, readParams)
                .then(data => data.value);

        const decryptParams = {
            CiphertextBlob: readValue
        };
        
        let result = await AWS.call(kms, 'decrypt', decryptParams)
                .then(data => data.Plaintext.toString('utf8'));
        return result;
    },
    
    save: async function(credentialName, value) {
        let resources = await awsUtils.resources(STACK_NAME, STACK_RESOURCES);
        
        const encryptParams = {
            KeyId: resources.credentialsKey,
            Plaintext: value
        };
        let encryptedValue = await AWS.call(kms, 'encrypt', encryptParams)
                .then(data => data.CiphertextBlob);

        const saveParams = {
            name: credentialName,
            value: encryptedValue
        };
        await dynamodb.save(resources.credentialsTable, saveParams);
    }
}

