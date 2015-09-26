/**
 * grunt-pagespeed-ngrok
 * http://www.jamescryer.com/grunt-pagespeed-ngrok
 *
 * Copyright (c) 2014 James Cryer
 * http://www.jamescryer.com
 */
'use strict';

var ngrok = require('ngrok');
var jpegoptim = require('imagemin-jpegoptim');

module.exports = function(grunt) {

    // Load grunt tasks
    require('load-grunt-tasks')(grunt);


    // Grunt configuration
    grunt.initConfig({

        uncss: {
            dist: {
                files: {
                    'src/css/style.css': ['src/index.html']
                }
            }
        },
        imagemin: {                          // Task
            static: {                          // Target
                options: {                       // Target options
                    optimizationLevel: 7,
                    progressive: true,
                    use: [jpegoptim()]
                },
                files: {
                    'public/img/2048.png': 'src/img/2048.png',
                    'public/img/cam_be_like.jpg': 'src/img/cam_be_like.jpg',
                    'public/img/mobilewebdev.jpg': 'src/img/mobilewebdev.jpg',
                    'public/img/profilepic.jpg': 'src/img/profilepic.jpg',
                    'views/images/pizza.png': 'views/images/pizza.png'
               }
            }
        },
        pagespeed: {
            options: {
                nokey: true,
                locale: "en_US",
                threshold: 40,
                url:"http://0.0.0.0:8080/"
            },
            local: {
                options: {
                    strategy: "desktop"
                }
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            }
        },
        concat: {
            cssPizza: {
                src: [
                    'views/css/*'
                ],
                dest: 'views/css/combinedPizza.css'
            },
            jsPizza:{
                src: [
                    'views/js/dataGenerator.js',
                    'views/js/main.js'
                ],
                dest: 'views/js/combinedJS.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'public/js/analyticsPerfomance.min.js': ['src/js/analytics.js', 'src/js/perfmatters.js'],
                    'views/js/combinedJS.min.js': ['views/js/combinedJS.js']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                keepSpecialComments: 0
            },
            target: {
                files: [{
                    'public/css/style.min.css' : 'src/css/style.css',
                    'public/css/print.min.css' : 'src/css/print.css',
                    'public/css/mobile.min.css' : 'src/css/mobile.css',
                    'views/css/combinedPizza.min.css':'views/css/combinedPizza.css'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'index.html': 'src/index.html',
                    'project-2048.html': 'src/project-2048.html',
                    'project-mobile.html': 'src/project-mobile.html',
                    'project-webperf.html': 'src/project-webperf.html'
                }
            }
        },

        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                files:[
                    {expand: true, src: ['*.html'], dest: '', ext: '.html.gz'},
                    {expand: true, src: ['public/js/*.js'], dest: '', ext: '.js.gz'},
                    {expand: true, src: ['public/css/*.css'], dest: '', ext: '.css.gz'}
                ]
            }
        },
        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16,
                deleteOriginals: true
            },
            assets: {
                files: [{
                    src: [
                        'index.gz.html',
                        'project-2048.gz.html',
                        'project-mobile.gz.html',
                        'project-webperf.gz.html'
                    ]
                }]
            }
        },
        jshint: {
            all: {
                src: 'views/js/main.js',
                options: {
                    bitwise: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    immed: true,
                    indent: 4,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonew: true,
                    quotmark: 'single',
                    regexp: true,
                    undef: false,
                    unused: true,
                    trailing: true
                }
            }
        },
        jsdoc : {
            dist : {
                src: ['views/js/main.js'],
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    // Register customer task for ngrok
    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 8080;

        ngrok.connect(port, function(err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });


    // Register default tasks
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['uncss','psi-ngrok','imagemin','concat','uglify','cssmin','htmlmin','cacheBust','compress']);
}
