/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { TodoItem } from './components/TodoItem';
import { Error } from './components/Error';
import { TodoErrorType } from './types/TodoErrorType';

export const App: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState<TodoFilter>(
    TodoFilter.All,
  );
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoError, setTodoError] = useState<TodoErrorType>(TodoErrorType.None);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  const uncompletedTodos = useMemo(
    () => todoList.filter(todo => !todo.completed),
    [todoList],
  );

  const completedTodos = useMemo(
    () => todoList.filter(todo => todo.completed),
    [todoList],
  );

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case TodoFilter.Active:
        return uncompletedTodos;
      case TodoFilter.Completed:
        return completedTodos;
      default:
        return todoList;
    }
  }, [completedTodos, currentFilter, todoList, uncompletedTodos]);

  const handleAddTodo = async (title: string): Promise<boolean> => {
    if (!title) {
      setTodoError(TodoErrorType.EmptyTitle);

      return false;
    }

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    setIsLoading(true);
    try {
      const createdTodo = await createTodo(title);

      setTodoList(prevTodoList => [...prevTodoList, createdTodo]);

      return true;
    } catch (error) {
      setTodoError(TodoErrorType.UnableToAddTodo);

      return false;
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodoList(prevTodoList => prevTodoList.filter(todo => todo.id !== id));
    } catch (error) {
      setTodoError(TodoErrorType.UnableToDeleteTodo);
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
      todoTitleRef.current?.focus();
    }
  };

  const handleDeleteCompletedTodos = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  useEffect(() => {
    const loadTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodoList(todosFromServer);
      } catch (error) {
        setTodoError(TodoErrorType.UnableToLoadTodos);
      }
    };

    loadTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoTitleRef={todoTitleRef}
          onAddTodo={handleAddTodo}
          isLoading={isLoading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDeleteTodo={handleDeleteTodo}
              isLoading={loadingTodos.includes(todo.id)}
            />
          ))}
        </section>

        {tempTodo && (
          <TodoItem todo={tempTodo} onDeleteTodo={handleDeleteTodo} isLoading />
        )}

        {!!todoList.length && (
          <TodoFooter
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            todosLeft={uncompletedTodos.length}
            completedTodos={completedTodos.length}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Error error={todoError} setError={setTodoError} />
    </div>
  );
};
