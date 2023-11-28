/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useState, useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './helpers/userId';
import { Todo } from './types/Todo';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoError } from './components/TodoError';
import { TodoFooter } from './components/TodoFooter';
import * as dataOperations from './api/todos';
import { Filter } from './types/Filter';

const filterTodos = (todos: Todo[], filter: Filter | ''): Todo[] => {
  switch (filter) {
    case Filter.all:
      return todos;
    case Filter.active:
      return todos.filter((todo) => !todo.completed);
    case Filter.completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoLoading, setIsTodoLoading] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const errorTimerId = useRef(0);

  const showErrorMessage = () => {
    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    showErrorMessage();
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');

    dataOperations
      .getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      });
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = ({ userId, title, completed }: Todo) => {
    setErrorMessage('');

    const temporaryTodo = {
      userId,
      title,
      completed,
      id: 0,
    };

    setTempTodo(temporaryTodo);
    setIsTodoLoading(temporaryTodo);
    setIsInputDisabled(true);

    return dataOperations
      .addTodoToServer({ userId, title, completed })
      .then((newTodo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setTodos(prev => prev.filter(todo => todo.id !== temporaryTodo.id));
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
        setIsTodoLoading(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');

    return dataOperations.deleteTodoOnServer(todoId)
      .then(() => {
        setTodos((currentTodo) => currentTodo.filter((todo) => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      });
  };

  const onCheckedToggle = (todoId: number) => {
    setTodos((currentTodo) => {
      return currentTodo.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      });
    });
  };

  const handleFilter = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const count = todos.filter((todo) => todo.completed !== true).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <TodoForm
            onSubmit={addTodo}
            onErrorMessage={setErrorMessage}
            onQuery={setQuery}
            query={query}
            isInputDisabled={isInputDisabled}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            onDelete={deleteTodo}
            onCheckedToggle={onCheckedToggle}
            todos={filteredTodos}
            isTodoLoading={isTodoLoading}
            tempTodo={tempTodo}
          />
        </section>

        {todos.length !== 0 && (
          <TodoFooter
            onTodoSelected={handleFilter}
            filter={filter}
            count={count}
            setTodos={setTodos}
            onErrorMessage={setErrorMessage}
            todos={todos}
          />
        )}
      </div>

      <TodoError onErrorMessage={setErrorMessage} errorMessage={errorMessage} />
    </div>
  );
};
