import { Provider } from 'react-redux';
import { store } from '../redux';

import GlobalErrorBoundary from '../components/GlobalErrorBoundary';
import App from './App';
import AppsContextComponent from '../components/AppsContext';

export default function Root() {
    return (
        <GlobalErrorBoundary>
            <Provider store={store}>
                <AppsContextComponent>
                    <App />
                </AppsContextComponent>
            </Provider>
        </GlobalErrorBoundary>
    )
}
