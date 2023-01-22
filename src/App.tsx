import { useEffect } from 'react';

import { TodoContent } from './components/Todo/TodoContent';

import { useTodoContext } from './store/todoContext';
import { Error } from './components/Error/Error';

export const App = () => {
  const { error, setError } = useTodoContext();

  useEffect(() => {
    if (!error[0]) {
      return;
    }

    setTimeout(setError, 3000);
  }, [error[0]]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent />

      <Error />
    </div>
  );
};
