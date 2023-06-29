import { useEffect, useState } from 'react';
import { getTodos } from '../../api/todos';
import { Form } from './form';
import { ToggleTodosButton } from './toggleTodosButton';
import { TodosFooter } from './todosFooter';
import { Todos } from './todos';
import { TodosError } from './todosError';

import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { USER_ID } from './consts';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.NONE);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => setTodos(res.slice(0)))
      .catch(() => setErrorType(ErrorType.LOAD));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  }, [errorType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleTodosButton
            todos={todos}
            setTodos={setTodos}
            onError={setErrorType}
          />

          <Form
            setTodos={setTodos}
            onError={setErrorType}
          />
        </header>

        <section className="todoapp__main">
          <Todos
            todos={todos}
            filter={filterType}
            onError={setErrorType}
            setTodos={setTodos}
          />
        </section>

        <TodosFooter
          todos={todos}
          filter={filterType}
          setFilter={setFilterType}
          setTodos={setTodos}
        />
      </div>

      <TodosError
        errorType={errorType}
        onError={setErrorType}
      />
    </div>
  );
};
