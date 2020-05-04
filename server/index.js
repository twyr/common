'use strict';

/**
 * Dummy call to "simulate" the process.
 *
 * @returns {void} Nothing.
 * @ignore
 */
const startServer = async function startServer() {
	await snooze(500);
	return;
};

startServer()
.then(() => {
	console.log(`Test done`);
})
.catch((err) => {
	console.error(err.toString());
});
