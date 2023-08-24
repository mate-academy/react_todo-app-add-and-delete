import React, { useEffect, useState } from 'react';

import { TodosHeader } from './Components/TodosHeader';
import { TodosFooter } from './Components/TodosFooter';
import { Todoslist } from './Components/TodosList';
import { TodosProvider } from './Components/TodosContext';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './Components/ErrorNotification';
import { ErrorMessage } from './Enum/ErrorMessage';
import { getTodos } from './api/todos';
import { useTodo } from './Hooks/UseTodo';
import { USER_ID } from './variables/userId';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const { setTodo, setIsError } = useTodo();
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodo(data))
      .catch(() => {
        setIsError(ErrorMessage.LOADING);
        setTodo([]);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodosProvider>
        <div className="todoapp__content">
          <TodosHeader setTempTodo={setTempTodo} />
          <Todoslist tempTodo={tempTodo} />
          <TodosFooter />
        </div>

        <ErrorNotification />
      </TodosProvider>
    </div>
  );
};
