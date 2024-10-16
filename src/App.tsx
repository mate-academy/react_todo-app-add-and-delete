import React, { useEffect, useState } from 'react';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoTemp } from './components/TodoTemp';
import { ErrorNotifications } from './components/Errors';

import { Todo } from './types/Todo';
import { Errors } from './types/ErrorsEnum';
import { Filter } from './types/FilterEnum';
import { handleError } from './handlers/handleError';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [inputChange, setInputChange] = useState('');
  const [focusOnChange, setFocusOnChange] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorNotification, setErrorNotification] = useState<Errors>(
    Errors.DEFAULT,
  );

  useEffect(() => {
    setErrorNotification(Errors.DEFAULT);
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(Errors.LOADING, setErrorNotification);
      });
  }, []);

  const handleDelete = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        handleError(Errors.DELETING, setErrorNotification);
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== todoId),
        );
        setFocusOnChange(current => !current);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputChange) {
      handleError(Errors.EMPTY, setErrorNotification);

      return;
    }

    const newTempTodo = {
      title: inputChange.trim(),
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setTempTodo(newTempTodo);

    const newTodo = {
      title: inputChange.trim(),
      userId: USER_ID,
      completed: false,
    };

    setLoadingTodoIds(currentIds => [...currentIds, 0]);

    addTodo(newTodo)
      .then(res => {
        setTodos(currentTodos => [...currentTodos, res]);
        setInputChange('');
      })
      .catch(() => {
        handleError(Errors.ADDING, setErrorNotification);
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== 0),
        );
        setTempTodo(null);
        setFocusOnChange(current => !current);
      });
  };

  const handleToggleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    const updates = {
      completed: event.target.checked,
    };

    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    updateTodo(todoId, updates)
      .then(res => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            res.id === currentTodo.id ? res : currentTodo,
          ),
        );
      })
      .catch(() => {
        handleError(Errors.UPDATING, setErrorNotification);
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== todoId),
        );
        setFocusOnChange(current => !current);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          inputChange={inputChange}
          loadingTodoIds={loadingTodoIds}
          focusOnChange={focusOnChange}
          onInputChange={setInputChange}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              onDelete={handleDelete}
              onToggleTodo={handleToggleTodo}
              loadingTodoIds={loadingTodoIds}
            />

            {tempTodo && (
              <TodoTemp loadingTodoIds={loadingTodoIds} tempTodo={tempTodo} />
            )}

            <Footer
              todos={todos}
              filter={filter}
              onDelete={handleDelete}
              onFilterChange={setFilter}
            />
          </>
        )}
      </div>

      <ErrorNotifications
        errorNotification={errorNotification}
        setErrorNotification={setErrorNotification}
      />
    </div>
  );
};
