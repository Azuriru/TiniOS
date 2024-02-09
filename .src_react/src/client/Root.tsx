import { Provider } from 'react-redux';
import { store } from '../redux';

import GlobalErrorBoundary from '../components/GlobalErrorBoundary';
import App from './App';
import AppsContextComponent from '../components/AppsContext';
import { StrictMode } from 'react';
import { nested } from '../util/react';
import ReduxLoader from '../components/ReduxLoader';

export default function Root() {
    return nested(
        StrictMode,
        GlobalErrorBoundary,
        Provider, { store },
        ReduxLoader,
        AppsContextComponent,
        App
    );
}
