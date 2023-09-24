import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { createTodo } from '../../api/todos';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header = () => {
  const [title, setTitle] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);

  const {
    todos,
    visibleTodos,
    setTodos,
    setTempTodo,
    setHasErrorMessage,
    setIsHiddenError,
    tempTodo,
  } = useContext(TodosContext);

  const prerapedTitle = title.trim();
  const inputRef = useRef<HTMLInputElement>(null);
  const findUncompletedTodo = visibleTodos.find(({ completed }) => !completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!prerapedTitle) {
      setHasErrorMessage('Title should not be empty');
      setIsHiddenError(true);
      setTimeout(() => {
        setIsHiddenError(false);
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      title: prerapedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setDisabledInput(true);
  };

  useEffect(() => {
    if (tempTodo) {
      createTodo({
        title: prerapedTitle,
        completed: false,
        userId: USER_ID,
      })
        .then(newPost => {
          setTodos((prevTodos) => [...prevTodos, newPost]);
          setTitle('');
        })
        .catch(() => {
          setHasErrorMessage('Unable to add a todo');
          setIsHiddenError(true);
          setTimeout(() => {
            setIsHiddenError(false);
          }, 3000);
        })
        .finally(() => {
          setDisabledInput(false);
          setTempTodo(null);
        });
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!findUncompletedTodo && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleOnSubmit}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
