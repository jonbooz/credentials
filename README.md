# Credentials

A library for accessing my credentials that I've stored in AWS. This also includes a simple node.js script for importing and deleting credentials.

## Including This Library

This library can be included in your node.js projects by including the following dependency:

    "credentials": "git+ssh://git@github.com:jonbooz/credentials.git"

Types are available for TypeScript.

## Command Line Tools

This module also comes with command line tool for writing credentials.  It is found in the `./bin` directory of this module.

    ./credential-save <name>

The script will prompt you for the value.

