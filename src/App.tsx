import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import { TodoFilter } from './types/TodoFilter';
import { Errors } from './Components/Errors/Errors';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';

const USER_ID = 11037;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFilterBy, setTodosFilterBy] = useState<TodoFilter>(
    TodoFilter.ALL,
  );
  const [isError, setIsError] = useState('');

  const showError = (text: string) => {
    setIsError(text);
    setTimeout(() => {
      setIsError('');
    }, 2000);
  };

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then((todo) => setTodos(todo))
      .catch(() => setIsError('Unable to load a todo'));
  }, []);

  const addTodo = ({
    userId,
    title,
    completed,
  }: Omit<Todo, 'id'>) => {
    postService
      .createTodos(USER_ID, { userId, title, completed })
      .then((newTodo) => setTodos((prevTodo) => [...prevTodo, newTodo]))
      .catch(() => showError('Unable to add a todo'));
  };

  const deleteTodo = (todoId: number) => {
    postService.deleteTodos(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (todosFilterBy) {
        case TodoFilter.ACTIVE:
          return !todo.completed;

        case TodoFilter.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todosFilterBy, todos]);

  const isActiveTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showError={showError}
          todos={todos}
          isActive={isActiveTodos.length}
          createTodo={addTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
            />

            <Footer
              filterBy={todosFilterBy}
              isActive={isActiveTodos}
              setFilterBy={setTodosFilterBy}
            />
          </>
        )}
      </div>

      {isError && <Errors error={isError} setIsError={setIsError} />}
    </div>
  );
};
