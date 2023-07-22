/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMesage } from './components/ErrorMessage/ErrorMesage';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
// import { fetchTodos } from './api/todos';

const USER_ID = 11028;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
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
    if (filter === Filter.ALL) {
      return todos;
    }

    return todos.filter(todo => {
      switch (filter) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [filter, todos]);

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

        {todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
            />

            <Footer
              filter={filter}
              isActive={isActiveTodos}
              setFilter={setFilter}
            />
          </>
        )}
      </div>

      {isError && (
        <ErrorMesage error={isError} setIsError={setIsError} />
      )}
    </div>
  );
};
