/**
 * Copy all given template files to the destination.
 */
exports.copyAllTemplates = function (generator, templates, data) {
  for (var source in templates) {
    generator.fs.copyTpl(
      generator.templatePath(source),
      generator.destinationPath(templates[source]),
      data
    );
  }
};


/**
 * Install npm dependencies if they don't exist.
 */
exports.npmInstallFast = function (generator, dependencies, dev) {
  // read existing dependencies
  var pkgFile = generator.destinationPath('package.json');
  var pkg = generator.fs.readJSON(pkgFile, {});
  var existingDeps = dev ? 'devDependencies' : 'dependencies';
  existingDeps = pkg[existingDeps] || {};
  // construct the right options for dev/general
  var options = {};
  options[dev ? 'saveDev' : 'save'] = true;
  var tag = dev ? 'npm-dep (dev): ' : 'npm-dep: ';
  // install the modules
  for (var i in dependencies) {
    var dep = dependencies[i];
    if (dep in existingDeps) {
      generator.log.identical(tag+dep);
    } else {
      generator.log.create(tag+dep);
      generator.npmInstall(dep, options);
    }
  }
};
