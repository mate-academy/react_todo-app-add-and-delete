/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Status } from './types/Status';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusOfTodos, setStatusOfTodos] = useState(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setloadingIds] = useState<number[]>([]);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  function loadTodos() {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  let filteredTodos = todos;

  if (statusOfTodos === Status.active) {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  if (statusOfTodos === Status.completed) {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  async function handleDeleteTodo(id: number) {
    setloadingIds(prev => [...prev, id]);
    setDeletingTodoId(id);

    try {
      await deleteTodos(id);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingTodoId(null);
      setloadingIds(prev => prev.filter(todoId => todoId !== id));
    }
  }

  function deleteCompletedTodo() {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => handleDeleteTodo(todo.id));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            setTodos={setTodos}
            tempTodo={tempTodo}
            isLoading={isLoading}
            setErrorMessage={setErrorMessage}
            handleDeleteTodo={handleDeleteTodo}
            deletingTodoId={deletingTodoId}
            setloadingIds={setloadingIds}
            loadingIds={loadingIds}
          />
          {!!todos.length && (
            <Footer
              todos={todos}
              setStatusOfTodos={setStatusOfTodos}
              statusOfTodos={statusOfTodos}
              deleteCompletedTodo={deleteCompletedTodo}
            />
          )}
        </section>
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
