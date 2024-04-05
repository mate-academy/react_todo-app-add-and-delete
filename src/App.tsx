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
import { filterTodos } from './utils/TodoHelpers/FilterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShouldFocusInput, setIsShouldFocusInput] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    postService
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        handleError('Unable to load todos', setErrorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isShouldFocusInput) {
      setIsShouldFocusInput(false);
    }
  }, [isShouldFocusInput]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const itemsLeft = todos.filter(({ completed }) => !completed).length;
  const haveCompletedTodos = todos.some(({ completed }) => completed);
  const allCompleted = todos.every(({ completed }) => completed);

  const filteredTodos = filterTodos(todos, status);

  const addTodo = (title: string, setTitle: (title: string) => void) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty', setErrorMessage);

      return;
    }

    setIsInputDisabled(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      status: status,
    };

    const fakeTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(fakeTodo);

    postService
      .postTodo(newTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setIsShouldFocusInput(true);
        setTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo', setErrorMessage);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const updateTodo = (patchTodo: Todo) => {
    postService.updateTodo(patchTodo).then(task => {
      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === task.id ? task : todo)),
      );
    });
  };

  const deleteTodo = (id: number) => {
    setIsLoading(true);
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
        setIsLoading(false);
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
          isInputDisabled={isInputDisabled}
          todos={todos}
          errorMessage={errorMessage}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteTodo}
          updateTodo={updateTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
        />
        {todos.length > 0 && (
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
