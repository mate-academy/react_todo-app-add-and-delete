import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import Header from './components/Header';
import Footer from './components/Footer';
import TodoList from './components/TodoList';
import { Status } from './types/Status';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import { handleError } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  useEffect(() => {
    setLoading(true);
    postService
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        handleError('Unable to load todos', setErrorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (shouldFocusInput) {
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const itemsLeft = todos.filter(({ completed }) => !completed).length;
  const haveCompletedTodos = todos.some(({ completed }) => completed);
  const allCompleted = todos.every(({ completed }) => completed);

  const filteredTodos = todos.filter(todo => {
    switch (status) {
      case Status.Active:
        return !task.completed;
        
      case Status.Completed:
        return task.completed;
        
      case Status.All:
      default:
        return true;
    }
  });

  const addTodo = (title: string, setTitle: (title: string) => void) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty', setErrorMessage);

      return;
    }

    setInputDisabled(true);

    const newTodo: Todo = {
      id: Math.max(0, Math.max(...todos.map(todo => todo.id))) + 1,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      status: status,
    };

    const fakeTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      status: status,
    };

    setTempTodo(fakeTodo);

    postService
      .postTodo(newTodo)
      .then(() => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setShouldFocusInput(true);
        setTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo', setErrorMessage);
      })
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
      });
  };

  const updateTodo = (patchTodo: Todo) => {
    postService.updateTodo(patchTodo).then(task => {
      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(({ id }) => id === task.id);

        newTodos[index] = task;

        return newTodos;
      });
    });
  };

  const deleteTodo = (id: number) => {
    setLoading(true);
    postService
      .deleteTodo(`/todos/${id}`)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todoItem => todoItem.id !== id));
      })
      .catch(() => {
        handleError('Unable to delete a todo', setErrorMessage);
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(duty => duty.completed)
      .map(duty => duty.id);

    completedTodoIds.forEach(id => {
      postService
        .deleteTodo(`/todos/${id}`)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todoItem => todoItem.id !== id),
          );
        })
        .catch(() => {
          handleError('Unable to delete a todo', setErrorMessage);
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          isAllCompleted={allCompleted}
          onAddTodo={addTodo}
          todosLength={todos.length}
          tempTodo={tempTodo}
          updateTodo={updateTodo}
          inputDisabled={inputDisabled}
          todos={todos}
          errorMessage={errorMessage}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteTodo}
          updateTodo={updateTodo}
          tempTodo={tempTodo}
          loading={loading}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            onStatusChange={setStatus}
            status={status}
            itemsLeft={itemsLeft}
            haveCompletedTodos={haveCompletedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
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

export default App;
