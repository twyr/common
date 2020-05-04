'use strict';

describe('Common Test Cases', function() {
	it('Should sleep for 25 milliseconds', async function() {
		await snooze(25);
		return;
	});
});
