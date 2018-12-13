export default function loadNativeModule(nativeModule) {
	return new Promise(resolve => {
		if (nativeModule.calledRun) {
			resolve()
		} else {
			const originalOnRuntimeInitialized = nativeModule.onRuntimeInitialized;

			nativeModule.onRuntimeInitialized = () => {
				if (originalOnRuntimeInitialized instanceof Function) {
					originalOnRuntimeInitialized();
				}

				resolve();
			};
		}
	})
}
