/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { USER_ID, createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoInput: React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  setTempTodo,
  inputRef,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    if (newTodo.title !== '') {
      setTempTodo({ ...newTodo, id: 0 });

      return createTodo(newTodo)
        .then(createdTodo => {
          setTodos(prev => [...prev, createdTodo]);
          setTempTodo(null);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
        })
        .finally(() => {
          setIsLoading(false);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        });
    } else {
      setErrorMessage('Title should not be empty');
    }

    setIsLoading(false);

    return null;
  };

  const todoToCreate = {
    title: title.trim(),
    userId: USER_ID,
    completed: false,
  };

  useEffect(() => {
    if (title !== '') {
      setErrorMessage('');
    }
  }, [title, setErrorMessage]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={event => {
          event.preventDefault();
          addTodo(todoToCreate);
        }}
      >
        <input
          ref={inputRef}
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
