/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodos, USER_ID } from './api/todos';
import { Todo, TodoFilterMethod } from './types/Todo';
import { UserWarning } from './UserWarning';
import { deleteTodo as deleteTodoAPI } from './api/todos';

import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import ErrorNotification from './components/ErrorNotification';
import { Spinner } from './components/Spinner';
import Filter from './components/Filter';
import TodoItem from './components/TodoItem';

const ERROR_HIDE_TIMEOUT = 3000;
let errorTimeoutId: null | NodeJS.Timeout = null;

function getFilteredTodos(todos: Todo[], method: TodoFilterMethod): Todo[] {
  let preparedTodos = [...todos];

  switch (method) {
    case TodoFilterMethod.All:
      break;
    case TodoFilterMethod.Active:
      preparedTodos = preparedTodos.filter(todo => !todo.completed);
      break;
    case TodoFilterMethod.Completed:
      preparedTodos = preparedTodos.filter(todo => todo.completed);
      break;

    // Exhaustive checking - Kyrylo Haiduk said that's a good practice
    default:
      throw new Error('Todo status not recognized in sorting logic');
  }

  return preparedTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showLoadingForCompletedTodos, setShowLoadingForCompletedTodos] =
    useState(false);
  const [todoFilterMethod, setTodoFilterMethod] = useState(
    TodoFilterMethod.Default,
  );

  const input = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    input.current!.focus();
  };

  /* It might seem weird that I use `isErrorMessageVisible` instead of
   just checking if `errMsg` is not empty. The reason I decided to create
   a dedicated state is because if I simply reset `errMsg`,
   the message disappears faster than the opacity transition duration,
   which looks strange. */
  const [errMsg, setErrMsg] = useState('');
  const [isErrorMessageVisible, setIsErrorMessageVisible] = useState(false);

  const preparedTodos: Todo[] = useMemo(() => {
    return getFilteredTodos(todos, todoFilterMethod);
  }, [todos, todoFilterMethod]);
  const todosLeft: number = todos.filter(td => !td.completed).length;

  const onTodoFilterChange = useCallback(
    (method: TodoFilterMethod) => {
      if (method !== todoFilterMethod) {
        setTodoFilterMethod(method);
      }
    },
    [todoFilterMethod],
  );

  const addTodo = useCallback((todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const hideErrMsg = useCallback(() => {
    setIsErrorMessageVisible(false);

    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
    }
  }, []);

  const showErrMsg = (msg: string) => {
    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
    }

    setErrMsg(msg);
    setIsErrorMessageVisible(true);

    errorTimeoutId = setTimeout(() => hideErrMsg(), ERROR_HIDE_TIMEOUT);
  };

  const showTempTodo = useCallback((todo: Todo) => {
    setTempTodo(todo);
  }, []);

  const hideTempTodo = useCallback(() => {
    setTempTodo(null);
  }, []);

  const deleteCompletedTodos = () => {
    setShowLoadingForCompletedTodos(true);

    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodoAPI(todo.id)
          .then(() => deleteTodo(todo.id))
          .catch(() => showErrMsg('Unable to delete a todo'))
          .finally(() => focusInput());
      }
    });
  };

  useEffect(() => {
    setErrMsg('');
    setIsFetching(true);

    getTodos()
      .then(data => setTodos(data))
      .catch(() => showErrMsg('Unable to load todos'))
      .finally(() => setIsFetching(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <NewTodo
            input={input}
            showTempTodo={showTempTodo}
            hideTempTodo={hideTempTodo}
            onAddTodo={addTodo}
            throwErr={showErrMsg}
            focusInput={focusInput}
          />
        </header>

        {isFetching ? (
          <Spinner />
        ) : (
          <>
            <TodoList
              todos={preparedTodos}
              deleteTodo={deleteTodo}
              throwErr={showErrMsg}
              focusInput={focusInput}
              showLoadingForCompletedTodos={showLoadingForCompletedTodos}
            />
            {tempTodo && (
              <TodoItem
                isLoading={true}
                focusInput={focusInput}
                todo={tempTodo}
              />
            )}
          </>
        )}

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosLeft} items left
            </span>

            <Filter
              currentMethod={todoFilterMethod}
              onSelect={onTodoFilterChange}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={todosLeft === todos.length}
              data-cy="ClearCompletedButton"
              onClick={() => {
                if (todosLeft !== todos.length) {
                  deleteCompletedTodos();
                }
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        isVisible={isErrorMessageVisible}
        msg={errMsg}
        onErrMsgHide={hideErrMsg}
      />
    </div>
  );
};
