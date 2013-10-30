/*
 * grunt-requirejs-bundle
 * https://github.com/cajones/grunt-requirejs-bundle
 *
 * Copyright (c) 2013 Chris Jones
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    AMDBundleProcesses = require('./AMDBundleProcesses');

module.exports = function(grunt) {

    var defaultOptions = {
        manifestFile: 'bower.json',
        autoGeneratedMessage: '/* This file has been automatically-generated by the grunt task requirejs-bundle; any changes to this file could be lost */'
    };

    grunt.registerMultiTask('requirejs-bundle', 'Grunt plugin to bundle one or more amd packages into a single define statement. This means you can just require the bundle and get all the packages loaded via requirejs.', function() {
        var options = this.options(defaultOptions),
            bundler = new AMDBundleProcesses(grunt, options),
            isDirectory = bundler.isDirectory.bind(bundler),
            enumerateInstalledPackages  = bundler.enumerateInstalledPackages.bind(bundler),
            buildAMDModuleDefinition = bundler.buildAMDModuleDefinition.bind(bundler);



        this.files.forEach(function (file) {
            var destModuleName = path.basename(file.dest, path.extname(file.dest)),
                moduleList = file.src.filter(isDirectory)
                                       .map(enumerateInstalledPackages)
                                       .reduce(buildAMDModuleDefinition, ''),
               defineStatement = 'define("'+ destModuleName +'", ['+ moduleList+ ']);',
               amdContent = options.autoGeneratedMessage + '\r\n' + defineStatement;
            
            grunt.file.write(file.dest, amdContent);
        });

    });

};
