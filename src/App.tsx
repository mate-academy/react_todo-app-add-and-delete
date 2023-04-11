/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ToodList } from './components/TodoList/TodoList';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Loader } from './components/Loader';
import { FilterType } from './types/FilterEnum';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

const USER_ID = 7006;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState('');
  const [title, setTitle] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo>();
  const [isLoading, setIsLoading] = useState(false);
  const [isHiddenNotification, setIsHiddenNotification] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.All);

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const addTodo = (todoTitle: string) => {
    const newTodo = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTemporaryTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then(result => {
        setTodos(state => [...state, result]);
      })
      .catch(() => {
        setIsError('Unable to add a todo');
        setTimeout(() => {
          setIsError('');
        }, 3000);
      })
      .finally(() => {
        setTemporaryTodo(undefined);
      });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setIsError('Tittle can not be empty');
      setTimeout(() => {
        setIsError('');
      }, 3000);

      return;
    }

    addTodo(title);
    setTitle('');
  };

  const removeTodo = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setIsError('Cant to delete a todo');
        setTimeout(() => {
          setIsError('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        setIsLoading(true);
        setIsError('');
        setIsHiddenNotification(true);
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        if (error instanceof Error) {
          setIsHiddenNotification(false);
          setIsError(error.message);
          setTimeout(setIsHiddenNotification, 3000, [true]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && (
        <Loader />
      )}

      <Header
        onChangeTitle={handleInputChange}
        onSubmitForm={handleFormSubmit}
        title={title}
      />

      <div className="todoapp__content">
        {todos.length > 0 && (
          <ToodList
            temporaryTodo={temporaryTodo}
            onDeleteTodo={removeTodo}
            todos={todos}
            filter={selectedFilter}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
            completedTodos={todos.length - activeTodos}
          />
        )}
      </div>

      <Notification
        isError={isError}
        onChangeStatus={() => setIsHiddenNotification}
        isHiddenNotification={isHiddenNotification}
      />
    </div>
  );
};
