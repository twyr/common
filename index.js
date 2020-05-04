'use strict';

/**
 * The name of the server - this is the name that is searched for in the database [modules.module_type = 'server' AND modules.name = ?].
 *
 * @ignore
 */
const SERVER_NAME = process.env.SERVER_NAME || 'TwyrCommon';

/**
 * Setup global variables (ugh!) to make life simpler across the rest of the codebase.
 *
 * @ignore
 */
global.twyrEnv = (process.env.NODE_ENV || 'development').toLocaleLowerCase();
process.title = SERVER_NAME;

/**
 *
 * @function
 * @global
 * @name	snooze
 *
 * @param   {number} [ms] - The number of millis to sleep.
 *
 * @returns {null} Nothing.
 *
 * @description
 * Utility to allow non-blocking sleep in async/await mode without the ugly setTimeout
 * appearing all over the place.
 *
 */
global.snooze = async (ms) => {
	const Promise = require('bluebird');
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

/**
 * Mandatory error handlers, just to ensure no unknown crashes happen.
 *
 * @ignore
 */
process.on('uncaughtException', (err) => {
	console.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
	process.exit(1); // eslint-disable-line no-process-exit
});

process.on('unhandledRejection', (reason, location) => {
	console.error(`Unhandled Rejection: ${reason} at:`, location);
});

/**
 * Start the actual process of doing business.
 *
 * @ignore
 */
require('./server/index.js');
