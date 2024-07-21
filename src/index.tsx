import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import {
  TodosProvider,
  ErrorProvider,
  TempTodoProvider,
  IsClearingProvider,
  IsUpdatingProvider,
} from './utils/Store';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <TodosProvider>
    <TempTodoProvider>
      <IsClearingProvider>
        <ErrorProvider>
          <IsUpdatingProvider>
            <App />
          </IsUpdatingProvider>
        </ErrorProvider>
      </IsClearingProvider>
    </TempTodoProvider>
  </TodosProvider>,
);
