(function() {
	if (parent != window && window.QUnit) {
		QUnit.done = function(data) {
			if (parent.TestRunner) {
				parent.TestRunner.done(data.failed, data.total, document.title);
			}

			if (window.__$coverObject) {
				parent.TestRunner.addCoverObject(window.__$coverObject);
			}
		};
	}
})();
