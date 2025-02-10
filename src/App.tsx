/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { ErrorTypes } from './types/ErrorTypes';
import { filterTodos } from './utils/filterTodos';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorTodo, setErrorTodo] = useState<ErrorTypes>(ErrorTypes.Empty);
  const [currentFilter, setCurrentFilter] = useState<Filters>(Filters.All);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorTodo(ErrorTypes.LoadTodo));
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todos, currentFilter),
    [todos, currentFilter],
  );

  function onAdd({ userId, title, completed }: Omit<Todo, 'id'>) {
    setIsLoading(true);
    setTempTodo({ id: 0, title, userId, completed });

    todoService
      .addTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currenTodos => [...currenTodos, newTodo]);

        if (titleRef.current) {
          titleRef.current.value = '';
        }
      })
      .catch(() => setErrorTodo(ErrorTypes.AddTodo))
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
        .catch(() => setErrorTodo(ErrorTypes.DeleteTodo)),
    );
  }

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          titleRef={titleRef}
          onAdd={onAdd}
          onError={setErrorTodo}
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
          <TodoFooter
            todos={todos}
            currentFilter={currentFilter}
            onFilter={setCurrentFilter}
            onDelete={onDelete}
          />
        )}
      </div>

      <TodoError error={errorTodo} onError={setErrorTodo} />
    </div>
  );
};
