'use strict';

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); // eslint-disable-line node/no-unpublished-require

	grunt.initConfig({
		'pkg': grunt.file.readJSON('package.json'),

		'env': {
			'mochaTest': {
				'NODE_ENV': 'test'
			}

		},

		'eslint': {
			'options': {
				'config': '.eslintrc',
				'format': 'junit',
				'outputFile': 'buildresults/eslint-orig.xml'
			},
			'target': ['.']
		},

		'exec': {
			'clean': {
				'command': 'npm run-script clean'
			},
			'docs': {
				'command': 'npm run-script docs'
			},
			'organize_build_results': {
				'command': 'mkdir -p ./buildresults/mocha && mkdir -p ./buildresults/eslint && mv ./buildresults/lint.xml ./buildresults/eslint/results.xml && mv ./buildresults/tests.xml ./buildresults/mocha/results.xml && mv ./coverage ./buildresults && mv ./.nyc_output ./buildresults'
			},
			'rename-docs': {
				'command': 'mv ./jsdoc_default/common/<%= pkg.version %> ./docs && rm -r ./jsdoc_default'
			},

			'test': {
				'command': 'npm run-script test'
			}
		},

		'xmlstoke': {
			'deleteESLintBugs': {
				'options': {
					'actions': [{
						'type': 'D',
						'xpath': '//failure[contains(@message, \'node_modules\')]/ancestor::testsuite'
					}]
				},
				'files': {
					'buildresults/eslint-no-bugs.xml': 'buildresults/eslint-orig.xml'
				}
			},
			'deleteEmptyTestcases': {
				'options': {
					'actions': [{
						'type': 'D',
						'xpath': '//testcase[not(node())]'
					}]
				},
				'files': {
					'buildresults/eslint-no-empty-testcases.xml': 'buildresults/eslint-no-bugs.xml'
				}
			},
			'deleteEmptyTestsuites': {
				'options': {
					'actions': [{
						'type': 'D',
						'xpath': '//testsuite[not(descendant::testcase)]'
					}]
				},
				'files': {
					'buildresults/eslint-no-empty-testsuites.xml': 'buildresults/eslint-no-empty-testcases.xml'
				}
			},
			'prettify': {
				'options': {
					'actions': [{
						'type': 'U',
						'xpath': '//text()'
					}]
				},
				'files': {
					'buildresults/lint.xml': 'buildresults/eslint-no-empty-testsuites.xml'
				}
			}
		},

		'jsbeautifier': {
			'src': ['buildresults/*.xml', 'docs/*.html'],
			'options': {
				'config': '.jsbeautifyrc'
			}
		},

		'clean': ['buildresults/eslint-orig.xml', 'buildresults/eslint-no-bugs.xml', 'buildresults/eslint-no-empty-testcases.xml', 'buildresults/eslint-no-empty-testsuites.xml', 'buildresults/coverage.raw.json']
	});

	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-xmlstoke');

	grunt.registerTask('default', ['exec:clean', 'env', 'eslint', 'exec:test', 'exec:docs', 'xmlstoke:deleteESLintBugs', 'xmlstoke:deleteEmptyTestcases', 'xmlstoke:deleteEmptyTestsuites', 'xmlstoke:prettify', 'exec:rename-docs', 'clean', 'jsbeautifier', 'exec:organize_build_results']);
};
