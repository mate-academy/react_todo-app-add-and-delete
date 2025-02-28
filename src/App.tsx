/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TodoStatus } from './types/TodoStatus';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { OmitTodo, Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { ErrorStatus } from './types/ErrorStatus';

export const App: React.FC = () => {
  const [filter, setFilter] = useState(TodoStatus.all);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorStatus.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorStatus.LOAD_TODOS));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case TodoStatus.active:
          return !todo.completed;
        case TodoStatus.completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  function onAdd({ title, userId, completed }: OmitTodo) {
    setIsLoading(true);
    setTempTodo({ id: 0, title, userId, completed });

    addTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);

        if (titleRef.current) {
          titleRef.current.value = '';
        }
      })
      .catch(() => setErrorMessage(ErrorStatus.ADD_TODO))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  function onDelete(todoIds: number[]) {
    setLoadingTodoIds(prevIds => [...prevIds, ...todoIds]);

    todoIds.forEach(todoId =>
      deleteTodos(todoId)
        .then(() =>
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          ),
        )
        .catch(() => setErrorMessage(ErrorStatus.DELETE_TODO))
        .finally(() => {
          setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
        }),
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          titleRef={titleRef}
          onAdd={onAdd}
          onError={setErrorMessage}
          isLoading={isLoading}
          loadingTodoIds={loadingTodoIds}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          loadingTodoIds={loadingTodoIds}
          onDelete={onDelete}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onDelete={onDelete}
          />
        )}
      </div>

      <TodoError errorMessage={errorMessage} onError={setErrorMessage} />
    </div>
  );
};
