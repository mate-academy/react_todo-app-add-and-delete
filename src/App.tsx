// #region imports
import { useEffect, useRef, useState } from 'react';

import * as todoService from './api/todos';
import { OmitTodo, Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { ErrorOptions } from './types/ErrorOptions';

import UserWarning from './UserWarning';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import TodoError from './components/TodoError';
// #endregion

export const App: React.FC = () => {
  // #region hooks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filterOption, setFilterOption] = useState(FilterOptions.ALL);
  const [errorOption, setErrorOption] = useState(ErrorOptions.NONE);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorOption(ErrorOptions.LOAD));
  }, []);
  // #endregion

  // #region filtered todos
  const filteredTodos = todos.filter(todo => {
    switch (filterOption) {
      case FilterOptions.ACTIVE:
        return !todo.completed;
      case FilterOptions.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });
  // #endregion

  // #region event handlers - add & delete
  function onAdd({ title, userId, completed }: OmitTodo) {
    setIsLoading(true);
    setTempTodo({ id: 0, title, userId, completed });

    todoService
      .addTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);

        if (titleRef.current) {
          titleRef.current.value = '';
        }
      })
      .catch(() => setErrorOption(ErrorOptions.ADD))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  function onDelete(todoIds: number[]) {
    setLoadingTodoIds(todoIds);

    todoIds.map(todoId =>
      todoService
        .deleteTodos(todoId)
        .then(() =>
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          ),
        )
        .catch(() => setErrorOption(ErrorOptions.DELETE))
        .finally(() => setLoadingTodoIds([])),
    );
  }
  // #endregion

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          titleRef={titleRef}
          onAdd={onAdd}
          onError={setErrorOption}
          isLoading={isLoading}
          loadingTodoIds={loadingTodoIds}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDelete}
          isLoading={isLoading}
          loadingTodoIds={loadingTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterOption={filterOption}
            onFilter={setFilterOption}
            onDelete={onDelete}
          />
        )}
      </div>

      <TodoError errorOption={errorOption} onError={setErrorOption} />
    </div>
  );
};
