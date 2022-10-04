// с лоудерами все ок
// блок then то не 3 сек в которых я могу что то делать
// то блок в котором я могу что то делать с запросом что уже пришел
// для кнопки чистки надо использовать промис ол и делать стейт с отфильтроваными айди что комплит
// и через инклуд в условии с лоудером искать а для поста и удаления просто постовить к массиву [0]

// 3я задача чтобы найти что чистим через фильтр делаем

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
import { AuthContext } from './components/Auth/AuthContext';

import { getTodos, postTodo, removeTodo } from './api/todos';

import { Todo } from './types/Todo';
import { User } from './types/User';

import { SortTypes } from './types/SortTypes';

import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<string>(SortTypes.All);
  // iscloseError
  const [closeError, setCloseError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);

  const [completedTodos, setCompletedTodos] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  if (closeError) {
    setTimeout(() => {
      setCloseError(false);
    }, 3000);
  }

  const filteredTodos = todos.filter(todo => {
    switch (sortType) {
      case SortTypes.All:
        return todo;

      case SortTypes.Active:
        return !todo.completed && SortTypes.Active;

      case SortTypes.Completed:
        return todo.completed && SortTypes.Completed;

      default:
        return null;
    }
  });

  const removeError = (boolean: boolean) => {
    setCloseError(boolean);
  };

  useEffect(() => {
    getTodos(user?.id || 0).then(response => {
      setTodos(response);
      // catch всегда принимает объект с ошибкой я ее тут просто игнорю
      // но в catch я тут пеердал пустой колбек
    }).catch(() => {
      setErrorMessage('Unable to load a todo');
      setCloseError(true);
    });
  }, [errorMessage]);

  const deleteTodo = (todoId: number) => {
    setSelectedTodoId(todoId);

    removeTodo(todoId)
      .then(() => {
        setSelectedTodoId(todoId);
        setErrorMessage(null);
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setCloseError(true);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setSelectedTodoId(null);
      });
  };

  const handleSortType = (type: string) => {
    setSortType(type);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // если ввожу пробелы то оно не добавляет так как ретерн
    // если после пробелов пишу что-то то добавляет без пробелов
    if (!title.trim()) {
      setErrorMessage("Title can't be empty");
      setTitle('');
      setCloseError(true);

      return;
    }

    setIsAdding(true);

    const test = [...todos];

    setTodos(prev => {
      return [...prev, {
        id: 0,
        userId: user?.id || 0,
        completed: false,
        title,
      }];
    });

    setSelectedTodoId(0);
    postTodo(user?.id || 0, title)
      .then(newTodo => {
        setIsAdding(false);
        setTodos([...test, newTodo]);
      })
      .catch(() => {
        setCloseError(true);
        setIsAdding(false);
        setErrorMessage('Unable to add a todo');

        setTodos((prev) => {
          return prev.filter(oneTodo => {
            return oneTodo.id !== 0;
          });
        });
      });

    setSelectedTodoId(0);
    setTitle('');
  };

  const clearTable = async () => {
    const filterTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    // console.log(filterTodos);

    setCompletedTodos(filterTodos);

    // console.log(completedTodos);

    try {
      await Promise.all(filterTodos.map(async (todoId) => {
        await removeTodo(todoId);

        setTodos(prevTodos => prevTodos
          .filter(todo => {
            return todo.id !== todoId;
          }));
      }));
    } catch {
      setCloseError(true);
      setErrorMessage('Unable to delete a todo');
      setCompletedTodos([]);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="make all todos active or vice versa"
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          filteredTodos={filteredTodos}
          // deleteTodo={deleteTodo}
          deleteTodo={deleteTodo}
          selectedTodoId={selectedTodoId}
          completedTodos={completedTodos}
        />
        <Footer
          clearTable={clearTable}
          handleSortType={handleSortType}
          sortType={sortType}
          filteredTodos={filteredTodos}
        />

      </div>

      <ErrorNotification
        closeError={closeError}
        removeError={removeError}
        errorMessage={errorMessage}
        // title={title}
        // titleError={titleError}
        // setTitleError={setTitleError}
      />
    </div>
  );
};
