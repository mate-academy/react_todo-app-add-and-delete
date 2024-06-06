/* eslint-disable no-param-reassign */
import { useContext, useState } from 'react';
import { USER_ID, addPost } from '../api/todos';
import { Todo } from '../types/Todo';
import { ActionType, TodoContext } from '../contexts/TodoContext';
import { ErrorContext } from '../contexts/ErrorContext';

export interface HeaderType {
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderType> = ({ inputRef }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const { dispatch } = useContext(TodoContext);
  const { setError } = useContext(ErrorContext);

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!todoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      title: todoTitle.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    dispatch({ type: ActionType.ADD, payload: newTodo });

    (inputRef.current as HTMLInputElement).disabled = true;

    addPost(newTodo)
      .then(response => {
        newTodo.id = response.id;

        setTodoTitle('');

        return;
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        dispatch({ type: ActionType.DELETE, payload: 0 });

        (inputRef.current as HTMLInputElement).disabled = false;
      })
      .then(() => {
        (inputRef.current as HTMLInputElement).focus();
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={e => addTodo(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
