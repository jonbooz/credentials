# Credentials

A library for accessing my credentials that I've stored in AWS. This also includes a simple node.js script for importing and deleting credentials.

## Including This Library

In order to include this library in your project, perform the following:

Register this library's repository as a submodule in your project

    git submodule add git@github.com:jonbooz/credentials.git credentials

Then include the project in the `settings.gradle` file:

    include ':project', ':credentials'

Finally, compile the library as a dependency in your project's `build.gradle` file:

    dependencies {
        compile project(':credentials')
    }

Then make sure you clone the project recursively in the future:

    git clone --recurse-submodules -j8 <project-url>
