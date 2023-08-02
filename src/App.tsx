import React, { useCallback, useEffect, useState } from 'react';
import * as todoService from './api/todos';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { prepareTodos } from './utils/filterTodos';
import { UserWarning } from './UserWarning';
import { TodoError } from './components/TodoError/TodoError';
import { Error } from './types/Error';

const USER_ID = 6909;

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortField, setSortField] = useState(Status.All);
  const [error, setError] = useState(Error.NONE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.LOAD));
  }, []);

  const addTodo = useCallback(({ title, completed, userId }: Todo) => {
    setIsLoading(true);

    todoService.createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setIsLoading(false);
      })
      .catch(() => setError(Error.ADD))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);

    return todoService.removeTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ));
      })
      .catch(err => {
        setError(Error.DELETE);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    if (!todoTitle.trim()) {
      setError(Error.EMPTY);
    }

    addTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: true,
    });

    setTodoTitle('');
    setIsLoading(false);
  };

  const todosExist = todos.length > 0;

  const completedTodos = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);
  const filteredTodos = prepareTodos(todos, sortField);

  const clearCompleted = () => {
    setIsLoading(true);

    try {
      const completedTodosIds = completedTodos.map(todo => todo.id);

      completedTodosIds.forEach(todoId => deleteTodo(todoId));
    } catch {
      setError(Error.DELETE);
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        {todosExist
          && (
            <section className="todoapp__main">
              <TodoList
                filteredTodos={filteredTodos}
                deleteTodo={deleteTodo}
                isLoading={isLoading}
              />
            </section>
          )}

        {todosExist && (
          <Footer
            numberOfCompletedTodos={completedTodos.length}
            numberOfNotCompletedTodos={notCompletedTodos.length}
            sortField={sortField}
            setSortField={setSortField}
            clearCompleted={clearCompleted}
          />
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
