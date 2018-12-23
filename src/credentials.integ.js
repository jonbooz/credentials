const AwsUtils = require('aws-utils');
const Credentials = require('./credentials.js');

const datetime = require('node-datetime');

const expect = require('chai').expect;

const CREDENTIAL_NAME = 'credentials-integ-test';

describe('Credentials', () => {
    it ('saves and reads a credential', async () => {
        const aws = new AwsUtils();
        const credentials = new Credentials(aws);

        const expected = datetime.create().format('Y-m-d H:I:S');

        await credentials.save(CREDENTIAL_NAME, expected);
        let result = await credentials.read(CREDENTIAL_NAME);
        expect(result).to.equal(expected);
    });

    it ('reads a scan of credentials', async () => {
        const aws = new AwsUtils();
        const credentials = new Credentials(aws);

        const value = datetime.create().format('Y-m-d H:I:S');
        const expected = { };
        expected[CREDENTIAL_NAME] = value;

        await credentials.save(CREDENTIAL_NAME, value);
        let result = await credentials.scan(CREDENTIAL_NAME);
        expect(result).to.eql(expected);

    });
});