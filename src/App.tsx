/* eslint-disable no-console */
import { useState } from 'react';
import { TodoContent } from './components/TodoContent';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isAddingErrorShown, setIsAddingErrorShown] = useState(false);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        hasLoadingError={hasLoadingError}
        setHasLoadingError={setHasLoadingError}
        setIsAddingErrorShown={setIsAddingErrorShown}
      />

      <ErrorNotification
        hasLoadingError={hasLoadingError}
        setHasLoadingError={setHasLoadingError}
        isAddingErrorShown={isAddingErrorShown}
        setIsAddingErrorShown={setIsAddingErrorShown}
      />
    </div>
  );
};
