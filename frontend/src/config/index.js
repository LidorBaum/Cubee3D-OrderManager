const environment = process.env.REACT_APP_ENVIRONMENT || 'prod';

function tryRequire(environment) {
    try {
        console.log('THE ENVIRONMENT IS!!!!!!' + environment);
        return require(`./${environment}`);
    } catch (err) {
        if ('MODULE_NOT_FOUND' === err.code) {
            throw Error(
                'Incorrect ENVIRONMENT variable set, exiting\nAllowed Environments:\n1. dev\n2. prod'
            );
        }
    }
}

const envConfig = tryRequire(environment);

module.exports = envConfig;
