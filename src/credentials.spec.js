const AwsUtils = require('aws-utils');

const sinon = require('sinon');
const expect = require('chai').expect;

const Credentials = require('./credentials.js');

beforeEach(() => {
    this.sandbox = sinon.createSandbox();
    this.aws = new AwsUtils();
    this.credentials = new Credentials(this.aws);
});

afterEach(() => {
    this.sandbox.restore();
});

describe('Credentials', () => {
    it('reads a credential', async () => {
        const expected = 'credential';

        const awsMock = this.sandbox.mock(this.aws);

        const resourcesMock = awsMock.expects('listStackResources');
        resourcesMock.returns(new Promise((resolve, reject) => {
            resolve([{credentialsTable: 'tableId'}]);
        }));

        const ddbReadStub = this.sandbox.stub(this.aws.ddb, 'read');
        ddbReadStub.returns(new Promise((resolve, reject) => {
            resolve({value: 'value'});
        }));

        const decryptMock = awsMock.expects('call');
        decryptMock
                .withArgs(sinon.match('KMS'), sinon.match('decrypt'), sinon.match.any)
                .once()
                .returns(new Promise((resolve, reject) => {
                        resolve({Plaintext: { toString: (p) => expected }});
                }));

        const res = await this.credentials.read('name');
        expect(res).to.equal(expected);
        
        awsMock.verify();
    });

    it('saves a credential', async () => {
        const expected = 'credential';

        const awsMock = this.sandbox.mock(this.aws);

        const resourcesMock = awsMock.expects('listStackResources');
        resourcesMock.returns(new Promise((resolve, reject) => {
            resolve([{credentialsTable: 'tableId'}, {credentialsKey: 'key'}]);
        }));

        const encryptMock = awsMock.expects('call');
        encryptMock
                .withArgs(sinon.match('KMS'), sinon.match('encrypt'), sinon.match.any)
                .once()
                .returns(new Promise((resolve, reject) => {
                        resolve({CiphertextBlob: 'encrypted'});
                }));

        const ddbSaveStub = this.sandbox.stub(this.aws.ddb, 'save');
        ddbSaveStub.returns(new Promise((resolve, reject) => {
            resolve({ });
        }));

        await this.credentials.save('name', 'value');
        
        awsMock.verify();
    });


});