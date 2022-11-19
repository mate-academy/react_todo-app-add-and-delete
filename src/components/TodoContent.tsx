/* eslint-disable no-console */
import {
  FC,
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodoList } from './TodoList';
import { getTodos, postTodos } from '../api/todos';
import { AuthContext } from './Auth/AuthContext';
import { Footer } from './Footer';
import { Todo } from '../types/Todo';

type Props = {
  hasLoadingError: boolean,
  setHasLoadingError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAddingErrorShown: React.Dispatch<React.SetStateAction<boolean>>,
};

export const TodoContent: FC<Props> = (
  {
    hasLoadingError,
    setHasLoadingError,
    setIsAddingErrorShown,
  },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isNewTodoLoaded, setIsNewTodoLoaded] = useState(true);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [
    isCompletedTodosDeleting, setIsCompletedTodosDeleting,
  ] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (newTodoField.current && hasLoadingError) {
      newTodoField.current.focus();
    }

    getTodos(user.id)
      .then((fetchedTodos) => {
        setVisibleTodos(fetchedTodos);
      })
      .catch(() => setHasLoadingError(true));
  }, []);

  useEffect(() => {
    async function updateTodos() {
      if (!user) {
        return;
      }

      const fetchedTodos = await getTodos(user.id);

      setTodos(fetchedTodos);
    }

    updateTodos();
  }, [visibleTodos]);

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClickedIndex(visibleTodos.length);
    const inputValue = newTodoField?.current?.value;

    if (inputValue?.length === 0) {
      setIsAddingErrorShown(false);
      setIsAddingErrorShown(true);

      return;
    }

    setIsNewTodoLoaded(false);

    const newTodoObj = {
      title: newTodoField.current?.value || '',
      userId: user?.id || 0,
      completed: true,
      id: 0,
    };

    setVisibleTodos(prev => [...prev, newTodoObj]);
    setTodos(visibleTodos);

    if (user && newTodoField.current) {
      postTodos(user.id, newTodoObj)
        .then(data => {
          setVisibleTodos((prev: Todo[]) => {
            setIsNewTodoLoaded(true);
            const prevArr = prev.slice(0, -1);

            return [...prevArr, data];
          });
        });

      newTodoField.current.value = '';
    }
  }

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        <button
          aria-label="toggle"
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form
          onSubmit={(event) => onSubmitHandler(event)}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>

      {visibleTodos.length > 0 && (
        <TodoList
          visibleTodos={visibleTodos}
          isNewTodoLoaded={isNewTodoLoaded}
          setVisibleTodos={setVisibleTodos}
          clickedIndex={clickedIndex}
          setClickedIndex={setClickedIndex}
          isCompletedTodosDeleting={isCompletedTodosDeleting}
        />
      )}
      <Footer
        setVisibleTodos={setVisibleTodos}
        todos={todos}
        visibleTodos={visibleTodos}
        setIsCompletedTodosDeleting={setIsCompletedTodosDeleting}
      />
    </div>
  );
};
