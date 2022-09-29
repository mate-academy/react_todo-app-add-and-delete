/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  FormEvent,
} from 'react';
import classnames from 'classnames';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';
import { FilterType } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

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
    // focus the element with `ref={newTodoField}`
    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Error.LOADING));

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.TITLE);

      return;
    }

    setIsAdding(true);

    try {
      const newTodo = await createTodo(userId, title);

      setTodos([...todos, newTodo]);
    } catch {
      setError(Error.ADDING);
    }

    setTitle('');
    setIsAdding(false);
  };

  const deleteTodo = (todoId: number) => {
    setSelectedTodos([todoId]);

    removeTodo(todoId)
      .then(() => {
        setTodos([...todos.filter(todo => todo.id !== todoId)]);
      })
      .catch(() => {
        setError(Error.DELETING);
      });
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteCompletedTodos = () => {
    setSelectedTodos([...completedTodos].map(todo => todo.id));

    Promise.all(completedTodos.map(todo => removeTodo(todo.id)))
      .then(() => setTodos([...todos.filter(todo => !todo.completed)]))
      .catch(() => {
        setError(Error.DELETING);
        setSelectedTodos([]);
      });
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
                { active: !todos.find(todo => !todo.completed) },
              )}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
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
