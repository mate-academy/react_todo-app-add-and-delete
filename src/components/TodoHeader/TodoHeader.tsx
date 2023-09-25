import React, { useState } from 'react';
// import classNames from 'classnames';
import { Todo } from '../../types/Todo';
// import { addTodo } from '../../api/todos';

interface Props {
  activeTodos: Todo[];
  newTodoField: React.RefObject<HTMLInputElement>;
  error: string;
  onTodoAdd: (title: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

export const TodoHeader: React.FC<Props> = ({
  activeTodos,
  newTodoField,
  error,
  setError,
  onTodoAdd,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    if (error) {
      setError('');
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    onTodoAdd(title)
      .then(() => {
        setTitle('');
      });
  };

  // const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   setError('');

  //   if (!title.trim()) {
  //     setError('Title should not be empty');

  //     setTimeout(() => {
  //       setError('');
  //     }, 3000);

  //     return;
  //   }

  //   setIsLoading(true);

  //   const newTodo = {
  //     id: 0,
  //     title: title.trim(),
  //     userId,
  //     completed: false,
  //   };

  //   setTempTodo(newTodo);

  //   addTodo(newTodo)
  //     .then((response) => {
  //       if (response) {
  //         setTodos((prevTodos) => [...prevTodos, response]);

  //         setTitle('');

  //         newTodoField.current?.focus();
  //       } else {
  //         setError('Unable to add a todo');
  //       }
  //     })
  //     .catch(() => {
  //       setError('Unable to add a todo');

  //       setTimeout(() => {
  //         setError('');
  //       }, 3000);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //       setTempTodo(null);
  //     });
  // };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!activeTodos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
        />
      )}

      {/* Add a todo on form submit */}
      {/* <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': tempTodo && isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div> */}

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={newTodoField}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
