/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import * as todoServices from './api/todos';
import { UserWarning } from './UserWarning';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';

const USER_ID = 11738;

enum FilterStatus {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<string>(FilterStatus.All);

  const filteredTodos = todos.filter((todo) => (
    (status === FilterStatus.All && todo)
    || (status === FilterStatus.Active && !todo.completed)
    || (status === FilterStatus.Completed && todo.completed)
  ));

  const loadTodos = () => {
    todoServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
  };

  useEffect(() => {
    if (USER_ID) {
      loadTodos();
    }
  }, [status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = ({ userId, title, completed }: Todo) => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      return null;
    }

    const todo = {
      id: 0,
      userId,
      title,
      completed,
    }

    setTempTodo(todo);

    return todoServices.createTodo(todo).then(() => {
      setTodos(currentTodos => [...currentTodos, todo])
    })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    return todoServices.deleteTodo(todoId)
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    return todoServices.updateTodo(updatedTodo)
      .then((todo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(post => post.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  const someoneCompletedTodo = todos.some(todo => !todo.completed);
  const toggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    Promise.all(updatedTodos.map(updatedTodo => {
      return todoServices.updateTodo(updatedTodo);
    }))
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(error => {
        setErrorMessage(`Unable to update a todo: ${error.message}`);
      });
  };

  const toggleButton = (
    <button
      type="button"
      data-cy="ToggleAllButton"
      className={cn('todoapp__toggle-all', {
        active: !someoneCompletedTodo,
      })}
      onClick={toggleAllTodos}
    />
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && toggleButton}

          <TodoForm
            onSubmit={addTodo}
            userId={USER_ID}
            todos={todos}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodo}
            />
            <Footer
              todos={todos}
              status={status}
              setStatus={setStatus}
              onDelete={deleteTodo}
            />
          </>
        )}
      </div>

      <ErrorMessage
        error={errorMessage}
        onCloseError={() => setErrorMessage('')}
      />
    </div>
  );
};
