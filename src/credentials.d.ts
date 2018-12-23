import * as AwsUtils from 'aws-utils';

export = Credentials;

/**
 * Provides methods for accessing encrypted credentials.
 * 
 * This assumes that your AWS Account has a CloudFormation stack
 * with name `credentials` with a DynamoDB table `credentialsTable`
 * and a KMS key `credentialsKey`.
 */
declare class Credentials {
    /**
     * 
     * @param aws An AwsUtils instance that can access a Credentials stack.
     */
    constructor(aws: AwsUtils);

    /**
     * This reads an encrypted credential stored in the stack.
     * 
     * It is assumed that the credential was saved by `save`.
     * 
     * @param {string} credentialName - The name of the credential.
     * @return {string} The unencrypted value of the credential.
     */
    read(credentialName: string): string;

    /**
     * This gets a set of credentials based on a leading prefix.
     * 
     * @param credentialPrefix - The initial prefix for a set of credentials
     * @return {_.Dictionary<string>} A mapping of credential names to values
     */
    scan(credentialPrefix: string): _.Dictionary<string>

    /**
     * This encrypts and saves the credential value into the stack.
     * 
     * @param {string} credentialName - The name of the credential.
     * @param {string} value - The credential's unencrypted value.
     */
    save(credentialName: string, credentialValue: string): void;
}