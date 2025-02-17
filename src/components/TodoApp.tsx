import { useEffect, useState } from 'react';

import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { TodoError } from './TodoError';

import { createTodo, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filter';
import { MessageError } from '../types/ErrorMessage';

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<MessageError>(
    MessageError.default,
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setIsError(true);
        setErrorMessage(MessageError.loadError);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isError) {
        setIsError(false);
        setErrorMessage(MessageError.default);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isError]);

  const addTodo = (str: string) => {
    return createTodo(str)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        throw error;
      });
  };

  const filterTodos = () => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos: Todo[] = filterTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          addTodo={addTodo}
          todos={todos}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
        />
        {todos.length > 0 && (
          <>
            <TodoList todos={filteredTodos} />
            <TodoFooter todos={todos} filter={filter} setFilter={setFilter} />
          </>
        )}
      </div>

      <TodoError
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
