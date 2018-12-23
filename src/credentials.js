const AwsUtils = require('aws-utils');
const _ = require('lodash');

const STACK_NAME = 'credentials';

module.exports = class Credentials {
    /**
     * @param {AwsUtils} aws - An AwsUtils instance, that covers this Credentials stack.
     */
    constructor(aws) {
        this.aws = aws;
    }

    /**
     * This reads an encrypted credential stored in the stack.
     *
     * It is assumed that the credential was saved by `save`.
     *
     * @param {string} credentialName - The name of the credential.
     * @return {string} The unencrypted value of the credential.
     */
    async read(credentialName) {
        let resources = await this.aws.listStackResources(STACK_NAME);

        const readParams = {
            name: credentialName
        };
        let readValue = await this.aws.ddb.read(resources.credentialsTable, readParams)
                .then(data => data.value);

        return await decryptValue(this.aws, readValue);
    }

    /**
     * 
     * @param {string} credentialPrefix 
     * @return {_.Dictionary<string>}
     */
    async scan(credentialPrefix) {
        let resources = await this.aws.listStackResources(STACK_NAME);

        const filterExpression = "begins_with(#n, :v1)";
        const filterValues = { ':v1': credentialPrefix };
        const filterNames = { '#n': 'name' } 
        let readData = await this.aws.ddb.scan(resources.credentialsTable,
                    filterExpression,
                    filterValues,
                    filterNames)
                .then(data => decryptData(this.aws, data))
                .then(data => _.fromPairs(data));

        return readData;
    }

    /**
     * This encrypts and saves the credential value into the stack.
     *
     * @param {string} credentialName - The name of the credential.
     * @param {string} value - The credential's unencrypted value.
     */
    async save(credentialName, value) {
        let resources = await this.aws.listStackResources(STACK_NAME);

        const encryptParams = {
            KeyId: resources.credentialsKey,
            Plaintext: value
        };
        let encryptedValue = await this.aws.call('KMS', 'encrypt', encryptParams)
                .then(data => data.CiphertextBlob);

        const saveParams = {
            name: credentialName,
            value: encryptedValue
        };
        await this.aws.ddb.save(resources.credentialsTable, saveParams);
    }
};

const decryptData = async function(aws, data) {
    const results = [ ];
    for (let i in data) {
        const d = data[i];
        let result = await decryptValue(aws, d.value);
        results.push([d.name, result]);
    }
    return results;
};

const decryptValue = async function(aws, value) {
    const decryptParams = {
        CiphertextBlob: value
    };
    let result = await aws.call('KMS', 'decrypt', decryptParams)
            .then(data => data.Plaintext.toString('utf8'));
    return result;
};