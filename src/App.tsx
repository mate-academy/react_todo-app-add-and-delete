/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  FormEvent,
} from 'react';
import classnames from 'classnames';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';
import { FilterType } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const inputField = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [toggle, setToggle] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(0);

  if (error) {
    setTimeout(() => {
      setError(null);
      setIsAdding(false);
    }, 3000);
  }

  let userId = 0;

  if (user?.id) {
    userId = user?.id;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return null;
    }
  });

  useEffect(() => {
    inputField.current?.focus();

    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Error.LOADING));
  }, []);

  useEffect(() => {
    inputField.current?.focus();
  }, [todos]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.TITLE);

      return;
    }

    setIsAdding(true);
    setSelectedTodos([userId]);

    try {
      const newTodo = await createTodo(userId, title);

      setTodos([...todos, newTodo]);
    } catch {
      setError(Error.ADDING);
    }

    setTitle('');
    setIsAdding(false);
    setSelectedTodos([]);
  };

  const deleteTodo = async (todoId: number) => {
    setSelectedTodos([todoId]);

    try {
      await removeTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setError(Error.DELETING);
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteCompletedTodos = async () => {
    setSelectedTodos([...completedTodos].map(todo => todo.id));

    try {
      await Promise.all(completedTodos.map(todo => removeTodo(todo.id)));

      setTodos([...todos.filter(todo => !todo.completed)]);
    } catch {
      setError(Error.DELETING);
      setSelectedTodos([]);
    }
  };

  const handleTodoUpdate = async (todoId: number, data: Partial<Todo>) => {
    setSelectedTodos([todoId]);

    try {
      const newTodo = await updateTodo(todoId, data);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? newTodo
          : todo
      )));
    } catch {
      setError(Error.UPDATING);
    }

    setSelectedTodos([]);
  };

  const handleToggle = async () => {
    setSelectedTodos(toggle
      ? [...todos].filter(todo => !todo.completed).map(todo => todo.id)
      : [...completedTodos].map(todo => todo.id));

    try {
      const newTodos = await Promise.all(todos.map(todo => (
        todo.completed !== toggle
          ? updateTodo(todo.id, { completed: toggle })
          : todo
      )));

      setTodos(newTodos);
    } catch {
      setError(Error.UPDATING);
    }

    setToggle(!toggle);
    setSelectedTodos([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classnames(
                'todoapp__toggle-all',
                { active: todos.every(todo => todo.completed) },
              )}
              onClick={handleToggle}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(isAdding || todos.length > 0) && (
          <>
            <TodosList
              todos={filteredTodos}
              title={title}
              isAdding={isAdding}
              onDelete={deleteTodo}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
              onUpdate={handleTodoUpdate}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />

            <Footer
              filterType={filterType}
              handleFilterType={setFilterType}
              todos={todos}
              deleteCompleted={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorNotification
          errorText={error}
          handleErrorChange={setError}
        />
      )}
    </div>
  );
};
