import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Category } from './utils/Category';
import { Error } from './utils/Error';
import { UserWarning } from './UserWarning';
import { TodoForm } from './Components/TodoForm';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import { addTodo, getTodos, removeTodo } from './api/todos';

const USER_ID = 10156;

export const App: React.FC = () => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isError, setIsError] = useState<Error | string>('');
  const [filterCategory, setFilterCategory] = useState(Category.All);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const todosAmount = visibleTodos.length;
  const hasCompleted = visibleTodos.some(todo => todo.completed);

  const handleError = (error: Error) => {
    setIsError(error);
    window.setTimeout(() => {
      setIsError('');
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setVisibleTodos(todos);
    } catch {
      handleError(Error.LOAD);
    }
  };

  const filterTodos = async (category: Category) => {
    const allTodos = await getTodos(USER_ID);

    const filteredTodos = allTodos.filter(todo => {
      switch (category) {
        case Category.Active:
          return !todo.completed;
        case Category.Completed:
          return todo.completed;
        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  };

  useEffect(() => {
    filterTodos(filterCategory);
  }, [filterCategory]);

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (!todoTitle) {
      handleError(Error.TITLE);

      return;
    }

    try {
      const todo: Todo = {
        title: todoTitle,
        id: 0,
        userId: USER_ID,
        completed: false,
      };

      const tempTodo = await addTodo(todo);

      setNewTodo(tempTodo);
      setIsLoading(false);
    } catch {
      handleError(Error.ADD);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await removeTodo(todoId);
      const filteredTodos = visibleTodos.filter(todo => todo.id !== todoId);

      setVisibleTodos(filteredTodos);
      setNewTodo(null);
    } catch {
      handleError(Error.DELETE);
    }
  };

  const handleTodoTitle = (title: string) => {
    setTodoTitle(title);
  };

  const clearCompletedTodo = async () => {
    try {
      const allId = visibleTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      visibleTodos.forEach(todo => {
        if (allId.includes(todo.id)) {
          removeTodo(todo.id);
        }
      });
    } catch {
      handleError(Error.DELETE);
    }
  };
  // const handleTodoUpdate = async (todoId: number, title: string) => {
  //   try {
  //     await updateTodo(todoId, title);
  //   } catch {
  //     handleError(Error.UPDATE);
  //   }
  // };

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
            title={todoTitle}
            onChange={handleTodoTitle}
            onAdd={handleAdd}
            isLoading={isLoading}
            onLoad={setIsLoading}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          onDelete={handleDelete}
          newTodo={newTodo}
        />

        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${todosAmount} items left`}
          </span>

          <TodoFilter
            filterCategory={filterCategory}
            changeCategory={setFilterCategory}
          />

          {/* don't show this button if there are no completed todos */}
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

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {isError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={() => setIsError('')}
          />
          {isError}
        </div>
      )}
    </div>
  );
};
