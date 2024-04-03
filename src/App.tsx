import { useState, useEffect, FC } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import Header from './components/Header';
import { Footer } from './components/Footer';
import TodoList from './components/TodoList';
import { Status } from './types/Status';
import { getTodos, postTodo, deleteTodoById } from './api/todos';
import { Todo } from './types/Todo';
import { handleError } from './utils/HandleErrorShow';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldQuery, setFieldQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocusInput, setFocusInput] = useState<boolean>(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos', setErrorMessage);
      });
  }, []);

  useEffect(() => {});

  if (!USER_ID) {
    return <UserWarning />;
  }

  const itemsLeft = todos.filter(({ completed }) => !completed).length;
  const haveCompletedTodos = todos.some(({ completed }) => completed);
  const allCompleted = todos.every(({ completed }) => completed);
  const filteredTodos = todos.filter(task => {
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

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const trimTodo = fieldQuery.trim();

    if (!trimTodo) {
      handleError('Title should not be empty', setErrorMessage);
      setFocusInput(true);
      setIsLoading(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimTodo,
      completed: false,
      status: status,
    };

    const copyNewTodo = { ...newTodo, id: todos.length + 1 };

    setTempTodo(newTodo);

    postTodo(newTodo)
      .then(() => {
        setTodos([...todos, copyNewTodo]);
        setFieldQuery('');
      })
      .catch(() => {
        handleError('Unable to add a todo', setErrorMessage);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setFocusInput(true);
      });
  };

  const deleteTodo = (id: number) => {
    setIsLoading(true);

    deleteTodoById(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todoItem => todoItem.id !== id));
      })
      .catch(() => {
        handleError('Unable to delete a todo', setErrorMessage);
      })
      .finally(() => {
        setIsLoading(false);
        setFocusInput(true);
      });
  };

  const clearCompleted = () => {
    setIsLoading(true);
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
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
          fieldQuery={fieldQuery}
          setFieldQuery={setFieldQuery}
          isLoading={isLoading}
          isFocusInput={isFocusInput}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onDeleteTodo={deleteTodo}
              tempTodo={tempTodo}
              isLoading={isLoading}
            />
            <Footer
              todos={todos}
              onClearCompleted={clearCompleted}
              onStatusChange={setStatus}
              status={status}
              itemsLeft={itemsLeft}
              haveCompletedTodos={haveCompletedTodos}
            />
          </>
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
