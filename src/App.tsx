/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { SortType } from './types/SortType';
import { Error } from './components/Error/Error';

const USER_ID = 11050;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sort, setSort] = useState(SortType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const completedTodo = todos.filter(todo => todo.completed === true);
  const activeTodo = todos.length - completedTodo.length;

  const getFiltered = (filter: SortType) => {
    switch (filter) {
      case SortType.Active:
        return todos.filter(todo => !todo.completed);

      case SortType.Completed:
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

  const onDeleteError = () => setErrorMessage('');

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodo = useMemo(() => getFiltered(sort), [todos, sort]);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage('WARNING!');

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
      setErrorMessage('Unable to delete todo');
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
                active: getFiltered(SortType.Completed)
                && filteredTodo.length === todos.length,
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
          todosFromServer={filteredTodo}
          onDelete={handleDelete}
          tempTodo={tempTodo}
        />

        {todos.length > 0
        && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodo} items left`}
            </span>
            <TodoFilter sort={sort} setSort={setSort} />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleAllDelete}
              style={
                {
                  opacity: completedTodo.length ? 1 : 0,
                }
              }
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <Error message={errorMessage} onDelete={onDeleteError} />
    </div>
  );
};
