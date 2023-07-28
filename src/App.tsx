import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import { Status } from './types/Status';
import { Errors } from './components/Errors/Errors';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

const USER_ID = 11098;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFilterBy, setTodosFilterBy] = useState<Status>(Status.ALL);
  const [isError, setIsError] = useState('');
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

  let timeoutId: NodeJS.Timeout;

  const showError = (text: string) => {
    setIsError(text);

    timeoutId = setTimeout(() => {
      setIsError('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then((todo) => {
        setTodos(todo);
        setIsLoadingTodos(false);
      })
      .catch(() => {
        setIsLoadingTodos(false);
        setIsError('Unable to load a todo');
      });
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

  const deleteTodo = async (todoId: number) => {
    try {
      await postService.deleteTodos(todoId);
      setTodos((currentTodos) => currentTodos.filter(
        (todo) => todo.id !== todoId,
      ));
    } catch (error) {
      showError('Unable to delete a todo');
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (todosFilterBy) {
        case Status.ACTIVE:
          return !todo.completed;

        case Status.COMPLETED:
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

        {isLoadingTodos ? (
          <div className="loader" />
        ) : (
          todos.length > 0 && (
            <>
              <TodoList
                todos={filteredTodos}
                isLoadingTodos={isLoadingTodos}
                deleteTodo={deleteTodo}
                showError={showError}
              />

              <Footer
                filterBy={todosFilterBy}
                isActive={isActiveTodos}
                setFilterBy={setTodosFilterBy}
              />
            </>
          )
        )}
      </div>

      {isError && <Errors error={isError} setIsError={setIsError} />}
    </div>
  );
};
