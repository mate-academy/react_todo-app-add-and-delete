/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { ErrorNotification } from './component/Error';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setfilterType] = useState('all');
  const [error, setError] = useState<string | null>('');
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const filteredTodos = todos
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

  userId = 0;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(userId)
      .then(setTodos)
      .catch(() => (setError('Unable to load todo from server')));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setError('Title can\'t be empty');
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

    setIsAdding(true);

    setTodos([...todos, newTodoAdd]);

    try {
      const newTodo = await createTodo(title, userId);

      setTodos([...todos, newTodo]);
    } catch {
      setError('Unable to add a todo');
      setTodos(filteredTodos.filter(todo => todo.id !== 0));
    }

    setTitle('');
    setIsAdding(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
  };

  const handleClickDelete = async (todoId: number) => {
    setSelectedTodo(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(currTodos => currTodos
        .filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
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
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          handleClickDelete={handleClickDelete}
          selectedTodo={selectedTodo}
        />

        <Footer
          filterType={filterType}
          setfilterType={setfilterType}
          filteredTodos={filteredTodos}
          todos={todos}
          handleClickDelete={handleClickDelete}
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
