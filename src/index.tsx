import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosProvider } from './components/todosContext';
import {
  ActiveProvider,
  AllProvider,
  CompletedProvider,
} from './components/filterContext';
import { ManageCheckboxProvider } from './components/manageCheckboxContext';
import { ErrorProvider } from './components/errorMessageContext';
import { LoaderProvider } from './components/loaderContext';
import { SubmitingProvider } from './components/isSubmitingContext';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <ManageCheckboxProvider>
    <AllProvider>
      <ActiveProvider>
        <CompletedProvider>
          <TodosProvider>
            <ErrorProvider>
              <LoaderProvider>
                <SubmitingProvider>
                  <App />
                </SubmitingProvider>
              </LoaderProvider>
            </ErrorProvider>
          </TodosProvider>
        </CompletedProvider>
      </ActiveProvider>
    </AllProvider>
  </ManageCheckboxProvider>,
);
