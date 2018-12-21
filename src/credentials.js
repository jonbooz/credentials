const AwsUtils = require('aws-utils');

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

        const decryptParams = {
            CiphertextBlob: readValue
        };
        let result = await this.aws.call('KMS', 'decrypt', decryptParams)
                .then(data => data.Plaintext.toString('utf8'));
        return result;
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
}
