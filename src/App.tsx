import React, { useEffect, useState } from 'react';

import { TodosHeader } from './Components/TodosHeader';
import { TodosFooter } from './Components/TodosFooter';
import { Todoslist } from './Components/TodosList';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './Components/ErrorNotification';
import { ErrorMessage } from './Enum/ErrorMessage';
import { getTodos } from './api/todos';
import { useTodo } from './Hooks/UseTodo';
import { USER_ID } from './variables/userId';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const { setTodos, setIsError, setLoading } = useTodo();
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorVisibility, setErrorVisibility] = useState(false);
  const [processings] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setLoading(false);
        setErrorVisibility(true);
        setIsError(ErrorMessage.LOADING);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodosHeader
          setTempTodo={setTempTodo}
          setErrorVisibility={setErrorVisibility}
        />
        <Todoslist
          tempTodo={tempTodo}
          processings={processings}
          setErrorVisibility={setErrorVisibility}
        />
        <TodosFooter />
      </div>

      <ErrorNotification
        errorVisibility={errorVisibility}
        setErrorVisibility={setErrorVisibility}
      />
    </div>
  );
};
