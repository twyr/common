'use strict';

describe('Common Test Cases', function() {
	it('Should sleep for a couple of seconds', async function() {
		await snooze(2000);
		return;
	});
});
