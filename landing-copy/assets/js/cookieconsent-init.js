/**
 * Inicializa Vanilla Cookie Consent con la configuración emitida desde PHP.
 */
(function () {
	var cfg = typeof window !== 'undefined' ? window.__MANDALA_COOKIE_CONSENT_CFG__ : null;
	if (!cfg || typeof CookieConsent === 'undefined' || typeof CookieConsent.run !== 'function') {
		return;
	}
	if (!cfg.cookie) {
		cfg.cookie = {};
	}
	if (typeof cfg.cookie.secure === 'undefined') {
		cfg.cookie.secure = window.location.protocol === 'https:';
	}
	try {
		CookieConsent.run(cfg);
	} catch (e) {
		if (typeof console !== 'undefined' && console.error) {
			console.error('[cookie-consent]', e);
		}
	}
})();
