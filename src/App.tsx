import cn from 'classnames';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorType } from './types/ErrorType';

import { TodoList } from './components/TodoList/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { ErrorMessages } from './components/ErrorMessages';

import { preperedTodos } from './helpers';
import * as todoService from './api/todos';

const USER_ID = 12013;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTitleDisabled, setIsTitleDisabled] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  const hasCompletedTodos = todos.some(todo => todo.completed);
  const uncompletedTodos = todos.filter(todo => !todo.completed).length;

  const showError = (error: ErrorType) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(ErrorType.NOT_LOADED_TODO));
  }, []);

  useEffect(() => {
    titleRef.current?.focus();
  }, [isTitleDisabled]);

  const visibleTodos = useMemo(() => {
    return preperedTodos(todos, selectedFilter);
  }, [selectedFilter, todos]);

  const createTodo = (title: string): Promise<void> => {
    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
      id: 0,
    };

    setTempTodo({ ...newTodo });

    return todoService.addTodo(newTodo)
      .then((response) => setTodos(
        currentTodos => [...currentTodos, response],
      ))
      .catch(() => {
        showError(ErrorType.NOT_ADD_TODO);
        throw new Error(ErrorType.NOT_ADD_TODO);
      })
      .finally(() => setTempTodo(null));
  };

  const handleSelectFilter = (status: Status) => {
    setSelectedFilter(status);
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed && todo.id) {
        todoService.deleteTodo(todo.id)
          .then(() => setTodos(
            current => (
              current.filter(completedTodo => !completedTodo.completed)
            ),
          ));
      }
    });
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(null);

    if (!todoTitle.trim().length) {
      showError(ErrorType.EMPTY_TITLE);

      return;
    }

    setIsTitleDisabled(true);

    createTodo(todoTitle.trim())
      .then(() => setTodoTitle(''))
      .finally(() => {
        setIsTitleDisabled(false);
      });
  };

  const removeTodo = (id: number) => {
    return todoService.deleteTodo(id)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== id),
      ))
      .catch(() => showError(ErrorType.NOT_DELETE_TODO));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) },
            )}
            data-cy="ToggleAllButton"
            aria-label="add-all"
          />

          <form onSubmit={event => addTodo(event)}>
            <input
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleRef}
              disabled={isTitleDisabled}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${uncompletedTodos} items left`}
            </span>

            <TodosFilter
              selectedFilter={selectedFilter}
              handleSelectFilter={handleSelectFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorMessages
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
