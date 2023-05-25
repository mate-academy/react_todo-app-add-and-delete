/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodosList } from './components/TodosList/TodosList';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { FilterType } from './types/Filter';
import { Error } from './types/Error';

const USER_ID = 9936;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(FilterType.ALL);
  const [isError, setIsError] = useState(Error.NONE);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [pendingTodoIds, setPendingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setIsError(Error.DOWNLOAD));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getFilteredTodos = (option: FilterType, todosToFilter: Todo[]) => {
    switch (option) {
      case FilterType.ACTIVE:
        return todosToFilter.filter(todo => todo.completed === false);

      case FilterType.COMPLETED:
        return todosToFilter.filter(todo => todo.completed === true);

      default:
        return todosToFilter;
    }
  };

  const hasSomeTodos = todos.length > 0;
  const visibleTodos = getFilteredTodos(filterOption, todos);
  const activeTodosAmount
    = todos.filter(todo => todo.completed === false).length;

  const handleError = (e: Error) => {
    setIsError(e);

    setTimeout(() => {
      setIsError(Error.NONE);
    }, 3000);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      handleError(Error.EMPTY);

      return;
    }

    setIsPending(true);
    setPendingTodoIds([...pendingTodoIds, 0]);

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    });

    const newTodo = {
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo)
      .then((result) => {
        setTodos([...todos, result]);
      })
      .catch(() => {
        handleError(Error.ADD);
      })
      .finally(() => {
        setNewTodoTitle('');
        setIsPending(false);
        setTempTodo(null);
        setPendingTodoIds([]);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsPending(true);
    setPendingTodoIds([...pendingTodoIds, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => handleError(Error.DELETE))
      .finally(() => {
        setIsPending(false);
        setPendingTodoIds([]);
      });
  };

  const completedTodos = todos.filter(todo => todo.completed === true);

  const handleClearCompleted = () => {
    const completedTodosIds
    = completedTodos.map(todo => todo.id);

    setPendingTodoIds([...completedTodosIds]);
    setIsPending(true);

    Promise.all(completedTodosIds.map(id => deleteTodo(id)))
      .then(() => setTodos(todos.filter(todo => todo.completed === false)))
      .catch(() => handleError(Error.DELETE))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasSomeTodos={hasSomeTodos}
          onAddTodo={handleAddTodo}
          isPending={isPending}
          newTodoTitle={newTodoTitle}
          onChangeNewTodoTitle={setNewTodoTitle}
        />

        <TodosList
          visibleTodos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          pendingStatus={isPending}
          pendingTodoIds={pendingTodoIds}
        />

        {hasSomeTodos && (
          <Footer
            filterOption={filterOption}
            onChangeFilterOption={setFilterOption}
            activeTodosAmount={activeTodosAmount}
            completedTodosAmount={completedTodos.length}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !isError },
          )
        }
      >
        <button
          type="button"
          className="delete"
          onClick={() => handleError(Error.NONE)}
        />
        {isError}
      </div>
    </div>
  );
};
