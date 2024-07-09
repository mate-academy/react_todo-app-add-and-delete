/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, USER_ID, deleteTodo } from './api/todos';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import classNames from 'classnames';
import { getPreparedTodos } from './utils/preparedTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = useMemo(
    () => getPreparedTodos(todos, filterBy),
    [todos, filterBy],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  function addTodo() {
    const correctTitle = newTodoTitle.trim();

    const newTempTodo = {
      id: 0,
      title: correctTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsDisabledInput(true);
    setTempTodo(newTempTodo);
    setIsLoading(ids => [...ids, 0]);

    createTodo({ title: correctTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
        setIsDisabledInput(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsDisabledInput(false);
        setTempTodo(null);
        setIsLoading(ids => ids.filter(todoId => todoId !== 0));
      });
  }

  function deleteTodoId(todoId: number) {
    setIsLoading(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading([]);
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodo={setNewTodoTitle}
          addTodo={addTodo}
          onError={setErrorMessage}
          onDisabled={isDisabledInput}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodoId}
          tempTodo={tempTodo}
          isLoading={isLoading}
        />

        {todos.length && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            handleSelect={setFilterBy}
            onDelete={deleteTodoId}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
