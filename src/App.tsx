/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { Filter, Status } from './types/Filters';

const USER_ID = 11808;

const filters: Filter[] = [
  { href: '/', title: Status.All },
  { href: '/active', title: Status.Active },
  { href: '/completed', title: Status.Completed },
];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedIds, setdeletedIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, errorMessage]);

  const completedTodos = todos.filter(todo => todo.completed);
  const uncompletedTodos = todos.filter(todo => !todo.completed);

  const renderedTodos = {
    [Status.All]: todos,
    [Status.Active]: uncompletedTodos,
    [Status.Completed]: completedTodos,
  };

  const newTodo: Omit<Todo, 'id'> = {
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  };

  const onToggleAll = useCallback(() => {
    const toggledTodos = todos.map(todo => ({
      ...todo,
      completed: completedTodos.length !== todos.length,
    }));

    setTodos(toggledTodos);
  }, [todos, setTodos, completedTodos.length]);

  const onUpdateTodos = useCallback((updatedTodo: Todo) => {
    const updatedTodos = [...todos];
    const index = updatedTodos.findIndex(todo => todo.id === updatedTodo.id);

    updatedTodos.splice(index, 1, updatedTodo);

    setTodos(updatedTodos);
  }, [todos]);

  const onAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.title && !newTodo.title.startsWith(' ')) {
      setErrorMessage('');
      setLoading(true);
      setTempTodo({ ...newTodo, id: 0 });

      todoService.createTodo(newTodo)
        .then(receivedTodo => {
          setTempTodo(null);
          setTodos(prevTodos => [...prevTodos, receivedTodo]);
          setTitle('');
        })
        .catch((error) => {
          setTempTodo(null);
          setErrorMessage('Unable to add a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const onDeleteTodo = (todoId: number) => {
    setdeletedIds(prevs => [...prevs, todoId]);
    setLoading(true);

    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearCompleted = () => {
    const deletePromises = completedTodos.map((todo) => onDeleteTodo(todo.id));

    (Promise.all(deletePromises));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.length === completedTodos.length,
            })}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={onAddTodo}>
            <input
              disabled={loading}
              value={title}
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={renderedTodos[filterBy]}
          onUpdateTodos={onUpdateTodos}
          tempTodo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          deletedIds={deletedIds}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${uncompletedTodos.length} items left`}
            </span>

            <TodosFilter
              filters={filters}
              filterBy={filterBy}
              onFilterBy={setFilterBy}
            />

            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
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
        {/* Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
