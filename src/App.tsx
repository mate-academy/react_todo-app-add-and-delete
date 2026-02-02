import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import Todos from './components/Todos/Todos';
import cn from 'classnames';
import TodoHeader from './components/TodoHeader/TodoHeader';
import TodoFooter from './components/TodoFooter/TodoFooter';
import { ErrorMessage, FilterStatus } from './types/enums';
import TodoItem from './components/TodoItem/TodoItem';
import { getVisibleTodos } from './helpers/todoHelpers';
import { CSSTransition } from 'react-transition-group';

export const App: React.FC = () => {
  const transitionTimeout = 300;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>(ErrorMessage.None);
  const [todosToDeleteIds, setTodosToDeleteIds] = useState<number[]>([]);

  const errorMsgTimeOutId = useRef<number>(0);
  const inputFocusRef = useRef<HTMLInputElement>(null);

  const handleErrorMessage = (msgType: ErrorMessage) => {
    setErrorMsg(msgType);

    clearTimeout(errorMsgTimeOutId.current);
    errorMsgTimeOutId.current = window.setTimeout(() => {
      setErrorMsg(() => ErrorMessage.None);
    }, 3000);
  };

  useEffect(() => {
    inputFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  const handleTodoToggle = useCallback(
    (todoId: number) => {
      setTodos(
        todos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      );
    },
    [todos],
  );

  function toggleDisableInput(shouldDisable: boolean = true) {
    if (inputFocusRef.current) {
      inputFocusRef.current.disabled = shouldDisable;
    }
  }

  const handleTodoDelete = useCallback((todoId: number) => {
    setTodosToDeleteIds(delIds => [...delIds, todoId]);

    toggleDisableInput();

    return deleteTodo(todoId)
      .then(() => {
        setErrorMsg(() => ErrorMessage.None);
        setTodos(prev => prev.filter(todoItem => todoItem.id !== todoId));
      })
      .catch(() => {
        handleErrorMessage(ErrorMessage.DeleteTodo);

        return Promise.reject();
      })
      .finally(() => {
        setTodosToDeleteIds(delIds => delIds.filter(id => id !== todoId));
        toggleDisableInput(false);
        inputFocusRef.current?.focus();
      });
  }, []);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todoItem => todoItem.completed);

    Promise.all(
      completedTodos.map(completed => {
        return handleTodoDelete(completed.id);
      }),
    );
  };

  const handleTodoAdd = (title: string) => {
    // TODO: remove normalization?
    const titleNormalized = title.trim();

    if (!titleNormalized) {
      handleErrorMessage(ErrorMessage.EmptyTitle);

      return Promise.reject(ErrorMessage.EmptyTitle);
    }

    const todoToAdd: Todo = {
      id: 0,
      title: titleNormalized,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todoToAdd);
    toggleDisableInput(true);

    return addTodo(todoToAdd)
      .then(todoResponse => {
        setErrorMsg(() => ErrorMessage.None);
        setTodos(currState => [
          ...currState,
          {
            ...todoResponse,
            id: Date.now(),
          },
        ]);
      })
      .catch(error => {
        handleErrorMessage(ErrorMessage.AddTodo);

        return Promise.reject(error);
      })
      .finally(() => {
        setTempTodo(null);
        toggleDisableInput(false);
        inputFocusRef.current?.focus();
      });
  };

  const handleFilterChange = (filter: FilterStatus) => {
    setFilterStatus(filter);
  };

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filterStatus),
    [todos, filterStatus],
  );

  const undoneTodosCount = useMemo(
    () => todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0),
    [todos],
  );

  const isAllTodosCompleted = undoneTodosCount === 0;
  const isAllTodosUncompleted = undoneTodosCount === todos.length;

  const handleToggleAll = () => {
    if (isAllTodosCompleted) {
      setTodos(todos.map(todo => ({ ...todo, completed: false })));
    } else {
      setTodos(todos.map(todo => ({ ...todo, completed: true })));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isAllTodosCompleted={isAllTodosCompleted}
          onToggleAll={handleToggleAll}
          onTodoAdd={handleTodoAdd}
          inputRef={inputFocusRef}
        />

        <Todos
          todos={visibleTodos}
          handleTodoToggle={handleTodoToggle}
          handleTodoRemove={handleTodoDelete}
          deletingTodoIds={todosToDeleteIds}
          transitionTimeout={transitionTimeout}
        />

        {tempTodo && (
          <CSSTransition timeout={300} classNames={'temp-item'}>
            <TodoItem todo={tempTodo} hasTempTodo={Boolean(tempTodo)} />
          </CSSTransition>
        )}

        {todos.length > 0 && (
          <TodoFooter
            undoneTodosCount={undoneTodosCount}
            isAllTodosUncompleted={isAllTodosUncompleted}
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMsg },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleErrorMessage(ErrorMessage.None)}
        />
        {errorMsg}
      </div>
    </div>
  );
};
