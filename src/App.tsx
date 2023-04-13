import React, { useEffect, useMemo, useState } from 'react';
import { Notification } from './components/Notification';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ToodList } from './components/TodoList/TodoList';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Loader } from './components/Loader';
import { FilterType } from './types/FilterEnum';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';

const USER_ID = 7006;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.All);

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const removeError = () => {
    setErrorMessage('');
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
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setTemporaryTodo(undefined);
      });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Tittle cannot be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    addTodo(title);
    setTitle('');
  };

  const removeTodo = (id: number) => {
    setLoadingIds(state => [...state, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Cant to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoadingIds(state => state.filter(el => el !== id));
      });
  };

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        setErrorMessage('');
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
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
          (
            <>
              <ToodList
                temporaryTodo={temporaryTodo}
                onDeleteTodo={removeTodo}
                loadingIds={loadingIds}
                todos={todos}
                filter={selectedFilter}
              />

              <Footer
                activeTodos={activeTodos}
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
                completedTodos={todos.length - activeTodos}
              />
            </>
          )
        )}
      </div>

      <Notification errorMessage={errorMessage} onDelete={removeError} />
    </div>
  );
};
