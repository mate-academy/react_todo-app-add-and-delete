/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo as addTodoApi,
  deleteTodo as deleteTodoApi,
  getTodos,
  USER_ID,
} from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
/* eslint-disable-next-line max-len */
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Filter } from './types/Filter';
import { Loader } from './components/Loader/Loader';
import { HeaderHandle } from './types/HeaderHandle';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitLoaderVisible, setIsInitLoaderVisible] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  useEffect(() => {
    let isLoaderShown = false;

    const timer = setTimeout(() => {
      setIsInitLoaderVisible(true);
      isLoaderShown = true;
    }, 500);

    getTodos()
      .then(todos => {
        setAllTodos(todos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        clearTimeout(timer);
        if (isLoaderShown) {
          setTimeout(() => {
            setIsInitLoaderVisible(false);
          }, 500);
        }
      });
  }, []);

  const headerRef = useRef<HeaderHandle>(null);

  const filteredTodos: Todo[] = useMemo(() => {
    switch (filter) {
      case 'All':
        return allTodos;
      case 'Completed':
        return allTodos.filter(todo => todo.completed);
      case 'Active':
        return allTodos.filter(todo => !todo.completed);
    }
  }, [filter, allTodos]);

  // console.log('all: ');
  // console.log(allTodos);
  // console.log('visible: ');
  // console.log(filteredTodos);
  // console.log('----------------------------');

  const activeCount = useMemo(() => {
    return allTodos.reduce(
      (accCount, todo) => (todo.completed ? accCount : accCount + 1),
      0,
    );
  }, [allTodos]);

  const setError = useCallback((error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const getTodoById = useCallback(
    (id: number) => {
      return allTodos.filter(todo => todo.id === id)[0];
    },
    [allTodos],
  );

  const addNewTodo = useCallback(
    (title: string) => {
      setError('');
      const trimmed = title.trim();

      if (!trimmed) {
        setError('Title should not be empty');

        return new Promise<void>(reject => {
          reject();
        });
      }

      const newTodo: Omit<Todo, 'id'> = {
        title: trimmed,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      return addTodoApi(newTodo)
        .then(addedTodo => {
          setAllTodos(prevList => [...prevList, addedTodo]);
        })
        .catch(error => {
          setError('Unable to add a todo');
          throw error;
        })
        .finally(() => {
          setTempTodo(null);
          headerRef.current?.focusInput();
        });
    },
    [setError],
  );

  const deleteTodo = useCallback(
    (todoId: number) => {
      setError('');

      return deleteTodoApi(todoId)
        .then(() => {
          setAllTodos(prevList => {
            const newList = [...prevList];

            newList.splice(prevList.indexOf(getTodoById(todoId)), 1);

            return newList;
          });
        })
        .catch(error => {
          setError('Unable to delete a todo');
          throw error;
        })
        .finally(() => headerRef.current?.focusInput());
    },
    [setError, getTodoById],
  );

  const toggleAllComplete = useCallback((allCompleted: boolean) => {
    setAllTodos(prevList => [
      ...prevList.map(todo => ({ ...todo, completed: !allCompleted })),
    ]);
  }, []);

  const toggleOneComplete = useCallback((todo: Todo) => {
    setAllTodos(prevList => {
      const newList = [...prevList];

      newList.splice(prevList.indexOf(todo), 1, {
        ...todo,
        ...{ completed: !todo.completed },
      });

      return newList;
    });
  }, []);

  const deleteCompleted = useCallback(() => {
    allTodos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [allTodos, deleteTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={headerRef}
          isAllCompleted={activeCount === 0}
          onAdd={addNewTodo}
          toggleComplete={toggleAllComplete}
        />
        {isInitLoaderVisible ? (
          <Loader />
        ) : (
          <TodoList
            todos={filteredTodos}
            toggleComplete={toggleOneComplete}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
          />
        )}

        {allTodos.length !== 0 && !isInitLoaderVisible && (
          <Footer
            onFilter={setFilter}
            currentFilter={filter}
            activeCount={activeCount}
            doesCompletedExist={activeCount < allTodos.length}
            clearCompleted={deleteCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onError={setError} />
    </div>
  );
};
