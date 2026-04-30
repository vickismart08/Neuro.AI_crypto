'use client';

import { useEffect } from 'react';

/**
 * Lightweight UI protections against casual source inspection.
 * Note: determined users can still inspect network responses/devtools.
 */
export default function ClientProtection() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const cmdOrCtrl = e.ctrlKey || e.metaKey;

      // Block common shortcuts for source/devtools.
      const blocked =
        key === 'f12' ||
        (cmdOrCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (cmdOrCtrl && key === 'u') ||
        (cmdOrCtrl && key === 's');

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  return null;
}
