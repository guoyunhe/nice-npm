import { render } from 'preact';

import { App } from './App';

// Find the package page heading and insert our mount point right after it.
const h1 = document.querySelector('h1');
if (h1) {
  const root = document.createElement('div');
  h1.insertAdjacentElement('afterend', root);
  render(<App />, root);
}
