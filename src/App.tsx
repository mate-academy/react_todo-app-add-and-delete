import React, { useEffect, useState } from 'react';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { USER_ID } from './utils/USER_ID';
import { Todo } from './types/Todo';
import { Category } from './types/Category';
import { TodoError } from './types/TodoError';
import { TodoForm } from './Components/TodoForm';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [todoError, setTodoError] = useState<TodoError | string>('');
  const [filterCategory, setFilterCategory] = useState(Category.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const todosAmount = todos.length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleError = (error: TodoError) => {
    setIsError(true);
    setTodoError(error);

    window.setTimeout(() => {
      setIsError(false);
      setTodoError('');
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleError(TodoError.UNABLE_LOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async (todoTitle: string) => {
    try {
      setIsLoading(true);
      const newTodo: Todo = {
        title: todoTitle,
        id: 0,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(newTodo);

      const todo = await addTodo(newTodo);

      setTodos([
        ...todos,
        todo,
      ]);
    } catch {
      handleError(TodoError.UNABLE_ADD);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await removeTodo(todoId);
      const filteredTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(filteredTodos);
    } catch {
      handleError(TodoError.UNABLE_DELETE);
    }
  };

  const clearCompletedTodo = async () => {
    try {
      const allId = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      todos.forEach(todo => {
        if (allId.includes(todo.id)) {
          removeTodo(todo.id);
        }
      });
    } catch {
      handleError(TodoError.UNABLE_DELETE);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" className="todoapp__toggle-all active" />

          <TodoForm
            onAdd={handleAdd}
            isLoading={isLoading}
            onLoad={setIsLoading}
            setError={handleError}
            setIsError={setIsError}
          />
        </header>

        <TodoList
          todos={todos}
          onDelete={handleDelete}
          tempTodo={tempTodo}
          category={filterCategory}
        />

        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${todosAmount} items left`}
          </span>

          <TodoFilter
            filterCategory={filterCategory}
            changeCategory={setFilterCategory}
          />

          {hasCompleted && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompletedTodo}
            >
              Clear completed
            </button>
          )}
        </footer>
      </div>

      {isError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={() => setTodoError('')}
          />
          {todoError}
        </div>
      )}
    </div>
  );
};
