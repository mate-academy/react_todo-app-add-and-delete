import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { USER_ID, getTodos, deleteTodo, addTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { getFilteredTodos } from './helpers';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.All);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState<boolean>(false);

  const hasCompletedTodos = todos.some((todo: Todo) => todo.completed);

  const activeTodosAmount = todos.filter(
    (todo: Todo) => !todo.completed,
  ).length;

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentError(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setCurrentError(Error.CannotLoad);
      });
  }, []);

  useEffect(() => {
    if (currentError) {
      setTimeout(() => setCurrentError(null), 3000);
    }
  }, [currentError]);

  useEffect(() => {
    todoInput.current?.focus();
  }, [todos, currentError]);

  const deleteTodoById = useCallback((id: number) => {
    deleteTodo(id)
      .then(() =>
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter((todo: Todo) => todo.id !== id),
        ),
      )
      .catch(() => {
        setCurrentError(Error.CannotDelete);
      });
  }, []);

  const createTodo = useCallback(() => {
    const todoTitle = newTodoTitle?.trim();

    if (!todoTitle.length) {
      setCurrentError(Error.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });

    setIsNewTodoLoading(true);

    addTodo(todoTitle)
      .then(newTodo => {
        setTodos(
          (currentTodos: Todo[]) => [...currentTodos, newTodo] as Todo[],
        );

        setNewTodoTitle('');
      })
      .catch(() => setCurrentError(Error.CannotAdd))
      .finally(() => {
        setTempTodo(null);
        setIsNewTodoLoading(false);
      });
  }, [newTodoTitle]);

  const clearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter((todo: Todo) => todo.completed);

    for (const todo of completedTodos) {
      deleteTodoById(todo.id);
    }
  }, [deleteTodoById, todos]);

  const handleFilterChange = useCallback((filter: Filter) => {
    return () => setCurrentFilter(filter);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleTitleChange={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          createTodo={createTodo}
          todoInput={todoInput}
          isNewTodoLoading={isNewTodoLoading}
        />

        {todos.length > 0 && (
          <TodoList
            todos={getFilteredTodos(todos, currentFilter)}
            handleDeleteTodo={deleteTodoById}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            handleDeleteTodo={deleteTodoById}
            isTemp={true}
          />
        )}

        {!!todos?.length && (
          <TodoFooter
            activeTodosAmount={activeTodosAmount}
            hasCompletedTodos={hasCompletedTodos}
            currentFilter={currentFilter}
            handleFilterChange={handleFilterChange}
            handleClearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        currentError={currentError}
        setCurrentError={setCurrentError}
      />
    </div>
  );
};
