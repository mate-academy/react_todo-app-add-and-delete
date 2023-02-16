import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodosList } from './components/TodosList';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Navigation } from './components/Navigation';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoStatus } from './types/TodoStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [textField, setTextField] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = (todoId: number) => {
    setTodos((prev: Todo[]) => prev.filter((todo) => todo.id !== todoId));
  };

  const submitAction = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !user) {
      return;
    }

    event.preventDefault();

    if (!textField.trim()) {
      setError(true);
      setMessageError("Title can't be empty");

      return;
    }

    setIsProcessing(true);

    try {
      setTempTodo({
        id: 0,
        title: textField,
        userId: user.id,
        completed: false,
      });

      const newTodo = await addTodo(user.id, {
        title: textField,
        userId: user.id,
        completed: false,
      });

      setTempTodo(null);
      setTodos((prev: any) => [...prev, newTodo]);
    } catch (mistake) {
      setError(true);
      setMessageError('Unable to add todo');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then((loadedTodos) => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setError(true);
        setMessageError('Unable to fetch data');
      });
  }, [user]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  function filterStatus(value: TodoStatus) {
    switch (value) {
      case TodoStatus.All:
        return todos;

      case TodoStatus.Active:
        return todos.filter((todo: Todo) => !todo.completed);

      case TodoStatus.Completed:
        return todos.filter((todo: Todo) => todo.completed);

      default:
        throw Error('Specify your status');
    }
  }

  const updatedTodos = filterStatus(status);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);

  const removeCompletedTodos = () => {
    completedTodos.forEach(async (todo: Todo) => {
      await removeTodo(todo.id);
    });

    setTodos((prev: Todo[]) => prev.filter(todo => !todo.completed));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="Mark all as complete"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              disabled={isProcessing}
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={textField}
              onChange={(event) => setTextField(event.target.value)}
              onKeyDown={submitAction}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodosList
            setOfItems={updatedTodos}
            deleteItem={handleDelete}
            tempTodo={tempTodo}
            setMessageError={setMessageError}
            setError={setError}
            isProcessing={isProcessing}
          />
        )}

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {todos.length}
              {' '}
              items left
            </span>

            <Navigation
              changeStatus={setStatus}
              status={status}
            />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={removeCompletedTodos}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      {!!error && (
        <ErrorNotification
          error={error}
          setError={setError}
          message={messageError}
          setMessage={setMessageError}
        />
      )}
    </div>

  );
};
