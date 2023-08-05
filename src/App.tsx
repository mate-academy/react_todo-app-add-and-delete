import React, { useEffect, useState } from 'react';
import * as todoServise from './api/todos';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { prepareTodos } from './utils/filterTodos';
import { UserWarning } from './UserWarning';
import { TodoError } from './components/TodoError';
import { Error } from './types/Error';

const USER_ID = 6909;

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortField, setSortField] = useState(Status.All);
  const [error, setError] = useState(Error.NONE);
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveIds, setIsActiveIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoServise.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.LOAD));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todosExist = todos.length > 0;
  const completedTodos = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  const filteredTodos = prepareTodos(todos, sortField);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!todoTitle.trim()) {
      setError(Error.NONE);
    }

    const newTodo = {
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setIsActiveIds([0]);

    try {
      const todo = await todoServise.createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, todo]);
    } catch {
      setError(Error.ADD);
    } finally {
      setIsLoading(false);
      setIsActiveIds([]);
      setTempTodo(null);
      setTodoTitle('');
    }
  };

  const deleteTodo = async (todoId: number) => {
    setIsLoading(true);
    setIsActiveIds([todoId]);

    try {
      await todoServise.removeTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setTodos(todos);
      setError(Error.DELETE);
      throw err;
    } finally {
      setIsActiveIds([0]);
      setIsLoading(false);
    }
  };

  const clearCompleted = () => {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    completedTodosIds.forEach(todoId => {
      deleteTodo(todoId);
      setIsActiveIds(completedTodosIds);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {notCompletedTodos.length > 0
            && (
              <button
                type="button"
                className="todoapp__toggle-all active"
                aria-label="toggleButton"
              />
            )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              disabled={isLoading}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        {todosExist
          && (
            <>
              <section className="todoapp__main">
                <TodoList
                  filteredTodos={filteredTodos}
                  onDelete={deleteTodo}
                  isLoading={isLoading}
                  isActiveIds={isActiveIds}
                  tempTodo={tempTodo}
                />
              </section>

              <Footer
                numberOfCompletedTodos={completedTodos.length}
                numberOfNotCompletedTodos={notCompletedTodos.length}
                sortField={sortField}
                setSortField={setSortField}
                clearCompleted={clearCompleted}
              />
            </>
          )}
      </div>

      {error
        && (
          <TodoError
            error={error}
            setError={setError}
          />
        )}
    </div>
  );
};
