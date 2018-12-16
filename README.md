# Credentials

A library for accessing my credentials that I've stored in AWS. This also includes a simple node.js script for importing and deleting credentials.

## Including This Library

This library can be included in your node.js projects by including the following dependency:

    "credentials": "git+ssh://git@github.com:jonbooz/credentials.git"

The library can then be included into your file with:

    const credentials = require('credentials');

And you can read specific credential with:

    credentials.read(<name>) :: Promise<String, Error>

## Command Line Tools

This module also comes with command line tools for reading and writing credentials.  They are found in the `./bin` directory of this module.

    ./credential-read <name>
    ./credential-save <name> <value>

> TODO `credential-save` should prompt for the value in password from so that it isn't saved to the history.
