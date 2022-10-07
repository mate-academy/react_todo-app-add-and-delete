/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './TodoList/Todolist';
import { Footer } from './Footer/Footer';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setfilterType] = useState('all');
  const [error, setError] = useState<Errors | null>(null);
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);

  const visibleTodos = todos
    .filter(todo => {
      switch (filterType) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        case FilterType.All:
          return todo;
        default:
          return 0;
      }
    });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(user?.id || 0)
      .then(setTodos)
      .catch(() => (setError(Errors.Load)));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim().length) {
      setError(Errors.Input);
      setTitle('');

      return;
    }

    if (!user) {
      return;
    }

    const newTodoAdd = {
      id: 0,
      userId: user.id,
      title,
      completed: false,
    };

    setTodos([...todos, newTodoAdd]);

    try {
      const newTodo = await createTodo(title, userId);

      setTodos([...todos, newTodo]);
    } catch {
      setError(Errors.Add);
      setTodos(visibleTodos.filter(todo => todo.id !== 0));
    }

    setTitle('');
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
  };

  const handleDelete = async (todoId: number) => {
    setSelectedTodo(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(currTodos => currTodos
        .filter(todo => todo.id !== todoId));
    } catch {
      setError(Errors.Delete);
    } finally {
      setSelectedTodo(prevIds => prevIds.filter(id => id !== todoId));
    }
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
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChange}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          handleDelete={handleDelete}
          selectedTodo={selectedTodo}
        />

        <Footer
          filterType={filterType}
          setfilterType={setfilterType}
          visibleTodos={visibleTodos}
          todos={todos}
          handleDelete={handleDelete}
        />
      </div>

      {error
        && (
          <ErrorNotification
            error={error}
            setError={setError}
          />
        )}
    </div>
  );
};
