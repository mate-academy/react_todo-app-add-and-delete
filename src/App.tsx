/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback, useEffect, useState, FC,
} from 'react';
import cn from 'classnames';
import {
  deleteTodo, getTodos, patchTodo, postTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoData } from './types/TodoData';
import { ErrorBy } from './types/ErrorBy';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 10331;

export const App: FC = () => {
  const [todoTemp, setTodoTemp] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [typeOfFilter, setTypeOfFilter] = useState<FilterBy>(FilterBy.ALL);
  const [typeOfError, setTypeOfError] = useState<ErrorBy | null>(null);
  const [isError, setIsError] = useState(false);
  const [disableWriting, setDisableWriting] = useState(false);

  const numberOfItemsLeft = todos
    .filter(({ completed }) => !completed).length;

  const hasCompletedTodos = numberOfItemsLeft !== todos.length;
  const hasTodos = todos.length > 0;

  const visibleTodos = todos.filter(({ completed }) => {
    switch (typeOfFilter) {
      case FilterBy.ACTIVE:
        return !completed;
      case FilterBy.COMPLETED:
        return completed;
      default:
        return true;
    }
  });

  const clearTitle = () => setTitle('');

  const loadTodos = useCallback(async () => {
    setIsError(false);
    setDisableWriting(true);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setIsError(true);
      setTypeOfError(ErrorBy.LOAD);
    }

    setDisableWriting(false);
  }, []);

  const handleAddTodo = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newTodo: TodoData = {
        userId: USER_ID,
        title,
        completed: false,
      };

      if (typeOfError === ErrorBy.LOAD
      || typeOfError === ErrorBy.ADD) {
        setTypeOfError(ErrorBy.ADD);
        throw new Error();
      }

      if (!title.trim()) {
        setTypeOfError(ErrorBy.EMPTY);
        throw new Error();
      }

      const temp = { ...newTodo, id: 0 };

      setTodoTemp(temp);

      await postTodo(newTodo);
      await loadTodos();
      setTodoTemp(null);
    } catch {
      setIsError(true);
    }

    clearTitle();
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch {
      setTypeOfError(ErrorBy.DELETE);
      setIsError(true);
    }
  };

  const deleteAllCompleded = async () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleChangeTodoCompleted = async (id: number, completed: boolean) => {
    await patchTodo(id, { completed: !completed });
    loadTodos();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {hasTodos && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: numberOfItemsLeft === 0,
              })}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={disableWriting}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          onChangeCompleted={handleChangeTodoCompleted}
          onDelete={handleDeleteTodo}
        />

        {todoTemp && (
          <TodoItem
            todo={todoTemp}
            onChangeCompleted={handleChangeTodoCompleted}
            onDelete={handleDeleteTodo}
          />
        )}

        {hasTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${numberOfItemsLeft} items left`}
            </span>

            <TodoFilter
              typeFilter={typeOfFilter}
              onChangeFilter={setTypeOfFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteAllCompleded}
              hidden={!hasCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {isError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {/* Add the 'hidden' class to hide the message smoothly */}
          <button
            type="button"
            className="delete hidden"
            onClick={() => setIsError(false)}
          />

          {/* Unable to update a todo */}
          {typeOfError}
        </div>
      )}
    </div>
  );
};
