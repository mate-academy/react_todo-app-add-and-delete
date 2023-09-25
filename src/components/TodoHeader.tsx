/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { CurrentError } from '../types/CurrentError';
import { TodoContext } from '../Context/TodoContext';
import { USER_ID } from '../utils/constants';

type Props = {};

export const TodoHeader: React.FC<Props> = () => {
  const {
    setError,
    addTodoHandler,
    setTempTodo,
    activeTodos,
    completedTodos,
    isLoading,
  } = useContext(TodoContext);
  const [title, setTitle] = useState('');
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputField.current?.focus();
    }
  }, [isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setTitle(newTitle.trimStart());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setError(CurrentError.EmptyTitleError);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });
    addTodoHandler(newTodo);
  };

  const activeTodosCount = activeTodos.length;
  const completedTodosCount = completedTodos.length;

  return (
    <header className="todoapp__header">
      {!!activeTodosCount && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: completedTodosCount },
          )}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            handleTitleChange(event);
          }}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
