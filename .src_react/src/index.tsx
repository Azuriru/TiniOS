import { assert } from 'assertmin';
import { createRoot } from 'react-dom/client';
import Root from './client/Root';

import './index.css';

const container = document.getElementById('root');
assert(container !== null);

const root = createRoot(container);
root.render(<Root />);
