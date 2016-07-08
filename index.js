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
 * Figure out what NPM dependencies have already been installed and print
 * appropriate messages.
 */
exports.resolveNpmConflicts = function resolveNpmConflicts(generator, dependencies, dev) {
  // read existing dependencies
  var pkgFile = generator.destinationPath('package.json');
  var pkg = generator.fs.readJSON(pkgFile, {});
  var existingDeps = dev ? 'devDependencies' : 'dependencies';
  existingDeps = pkg[existingDeps] || {};
  var results = [];
  var tag = dev ? 'npm-dep (dev): ' : 'npm-dep: ';
  // install the modules
  for (var i in dependencies) {
    var dep = dependencies[i];
    if (dep in existingDeps) {
      generator.log.identical(tag+dep);
    } else {
      generator.log.create(tag+dep);
      results.push(dep);
    }
  }
  return results;
};


exports.resolveNpmConflictsStage = function resolveNpmConflictsStage(generator, dependencies, dev) {
  return function () {
    return resolveNpmConflicts(generator, dependencies, dev);
  };
};


/**
 * Install npm dependencies if they don't exist.
 */
exports.npmInstallFast = function npmInstallFast(generator, dependencies, dev) {
  dependencies = resolveNpmConflicts(generator, dependencies, dev);

  if (dependencies) {
    var options = {};
    options[dev ? 'saveDev' : 'save'] = true;
    generator.npmInstall(dependencies, options);
  }
};
