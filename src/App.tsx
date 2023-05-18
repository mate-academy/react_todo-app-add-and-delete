/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './Components/ErrorMessage';

const USER_ID = 10390;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const completedTodo = todos.filter(todo => todo.completed === true);
  const activeTodos = todos.length - completedTodo.length;

  const getFiltered = (filter: FilterType) => {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const createTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Unable to add todo');
    }
  }, []);

  const onDeleteError = useCallback(
    async () => setErrorMessage(''), [errorMessage],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodo = useMemo(() => getFiltered(filterBy), [todos, filterBy]);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        // setErrorMessage('Title can\'t be empty');
        setErrorMessage('Sergii are you seriously?');

        return;
      }

      setErrorMessage('');

      const todoToAdd: Todo = {
        id: 0,
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...todoToAdd });

      try {
        const newTodo = await addTodo(todoToAdd);

        createTodo(newTodo);
        setTitle('');
      } catch {
        setErrorMessage('Unable to add todo');
      }

      setTempTodo(null);
    }, [title],
  );

  const handleDelete = useCallback(async (todoToDelete: Todo) => {
    try {
      onDeleteError();
      setTempTodo(todoToDelete);
      await deleteTodo(todoToDelete.id);
      loadTodos();
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setTempTodo(null);
  }, []);

  const handleAllDelete = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    completedTodos.map(todo => handleDelete(todo));
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all', {
                active: filteredTodo.length === completedTodo.length,
              },
            )}
          />

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>
        <TodoList
          todos={filteredTodo}
          onDelete={handleDelete}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos} items left`}
            </span>
            <TodoFilter filter={filterBy} setFilter={setFilterBy} />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleAllDelete}
              style={
                {
                  opacity: completedTodo.length === 0
                    ? 0
                    : 1,
                }
              }
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <ErrorMessage message={errorMessage} onDelete={onDeleteError} />
    </div>
  );
};
