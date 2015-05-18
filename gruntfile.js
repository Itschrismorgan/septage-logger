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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat','uglify']);
    grunt.registerTask('dev', ['concat']);
};