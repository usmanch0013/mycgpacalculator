"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cgpacalcpro_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie notice">
      <div className="cookie-banner-inner container">
        <p className="cookie-banner-text">
          We use cookies for basic site features and, once approved, to show ads that help keep CGPA Calculator Pro free.
          Your calculator grades never leave your browser. Read our{' '}
          <Link href="/cookies">Cookie Policy</Link> and{' '}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <div className="cookie-banner-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={accept}>
            Got it
          </button>
          <Link href="/cookies" className="btn btn-outline btn-sm cookie-banner-link">
            Manage preferences
          </Link>
        </div>
      </div>
    </div>
  );
}
