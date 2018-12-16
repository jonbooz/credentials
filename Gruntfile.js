module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cloudformation: {
            options: {
                region: 'us-west-2'
            },
            createStack: {
                action: 'create-stack',
                stackName: 'credentials',
                deleteIfExists: true,
                src: ['cloudFormation/credentials.json']
            },
            updateStack: {
                action: 'update-stack',
                stackName: 'credentials',
                capabilities: ['CAPABILITY_IAM'],
                src: ['cloudFormation/credentials.json']
            }
        },
        jshint: {
            gruntfile: "Gruntfile.js",
            src: ["src/**/*.js"],
            options: {
                esversion: 6,
                node: true,
                '-W053': true,
                '-W083': true
            }
        },
        clean: ['build/']
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-aws-cloudformation');

    grunt.registerTask('create-stack', ['cloudformation:createStack']);
    grunt.registerTask('update-stack', ['cloudformation:updateStack']);
    grunt.registerTask('test', ['jshint']);

    // Default task(s).
    grunt.registerTask('default', ['test']);
    grunt.registerTask('debug', ['test']);

};
