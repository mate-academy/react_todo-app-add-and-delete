/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, deleteTodo, USER_ID } from './api/todos';
import { TodoItem } from './components/TodoItem';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { Notification } from './components/Notification';
import { TodoHeader } from './components/TodoHeader';
import { Status } from './types/Status';

enum ErrorMessage {
  LOAD_TODOS = 'Unable to load todos',
  ADD_TODO = 'Unable to add a todo',
  DELETE_TODO = 'Unable to delete a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>('all');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteOnTodo, setDeleteOnTodo] = useState<number[]>([]);
  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LOAD_TODOS));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => setErrorMessage(''), 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  const handleAddTodo = (title: string): Promise<void> => {
    setErrorMessage('');

    setTempTodo({ id: 0, userId: USER_ID, title, completed: false });

    return postTodo({ userId: USER_ID, title, completed: false })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.ADD_TODO);

        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (id: number): Promise<void> => {
    setDeleteOnTodo(current => [...current, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE_TODO);
      })
      .finally(() => {
        setDeleteOnTodo(current => current.filter(item => item !== id));
        inputFocusRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');

    todos
      .filter(todo => todo.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  const filteredTodos = todos.filter(todo => {
    switch (status) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }


  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onError={setErrorMessage}
          onSubmit={handleAddTodo}
          onFocus={inputFocusRef}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  todo={todo}
                  key={todo.id}
                  onDelete={id => {
                    setErrorMessage('');

                    return handleDeleteTodo(id);
                  }}
                  isLoading={deleteOnTodo.includes(todo.id)}
                />
              ))}
              {tempTodo && <TodoItem todo={tempTodo} isLoading />}
            </section>

            {todos.length > 0 && (
              <TodoFooter
                todos={todos}
                selectedFilter={status}
                onSelected={setStatus}
                onReset={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
