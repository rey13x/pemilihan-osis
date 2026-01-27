// Security utility to prevent tampering

export const initializeSecurityMeasures = () => {
  // Disable console
  Object.defineProperty(window, 'console', {
    value: new Proxy(console, {
      get(target, prop) {
        if (['log', 'error', 'warn', 'info', 'debug'].includes(prop)) {
          return () => {};
        }
        return target[prop];
      }
    }),
    writable: false
  });

  // Disable developer tools
  const disableDevTools = () => {
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C
        (e.key === 'F12') || // F12
        (e.ctrlKey && e.key === 'u') // Ctrl+U (View Source)
      ) {
        e.preventDefault();
        return false;
      }
    });

    // Detect DevTools opening
    let devtoolsOpen = false;
    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          // Redirect or warn
          window.location.href = '/';
        }
      } else {
        devtoolsOpen = false;
      }
    }, 500);
  };

  disableDevTools();

  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable text selection on sensitive areas
  document.addEventListener('selectstart', (e) => {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('.secure-content')) {
      e.preventDefault();
      return false;
    }
  });

  // Override localStorage to add validation
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    if (typeof value === 'string' && value.length > 10000) {
      console.error('Value too large');
      return;
    }
    originalSetItem.apply(this, arguments);
  };

  // Prevent modification of critical functions
  Object.defineProperty(window, 'eval', {
    value: function() {
      throw new Error('eval is disabled');
    }
  });
};

// Validate user data integrity
export const validateUserData = (user) => {
  if (!user || typeof user !== 'object') return false;
  if (!user.nis || typeof user.nis !== 'string') return false;
  if (!user.kelas || typeof user.kelas !== 'string') return false;
  if (!user.jurusan || typeof user.jurusan !== 'string') return false;
  return true;
};

// Verify one comment per user on frontend
export const hasUserCommented = (comments, userNis) => {
  return comments.some(c => c.nis === userNis);
};
