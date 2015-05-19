module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'public/dist/app.js',
                dest: 'public/dist/app.min.js'
            }
        },
        watch: {
            scripts: {
                files: 'public/javascripts/**/*.js',
                tasks: ['dev'],
                options: {
                    interrupt: true
                }
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: ['public/javascripts/main.js','public/javascripts/**/*.js'],
                dest: 'public/dist/app.js'
            }
        },
        nodemon: {
            dev: {
                script: './bin/www',
                options: {
                    args: ['dev'],
                    nodeArgs: ['--debug'],
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    },
                    env: {
                        PORT: '3000'
                    },
                    cwd: __dirname,
                    ignore: ['node_modules/**'],
                    ext: 'js',
                    watch: ['server', 'routes'],
                    delay: 1000,
                    legacyWatch: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['concat','uglify']);
    grunt.registerTask('dev', ['concat']);
};