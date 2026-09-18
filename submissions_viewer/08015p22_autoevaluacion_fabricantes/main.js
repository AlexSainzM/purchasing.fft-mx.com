// Compatibility entry point. Shared runtime used by all viewers.
const script = document.createElement('script');
script.src = new URL('../shared/main.js', document.currentScript.src).href;
document.head.append(script);
