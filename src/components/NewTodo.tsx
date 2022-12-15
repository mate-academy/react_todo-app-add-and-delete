import React, { useEffect } from 'react';
import { Notifications } from '../types/Notifications';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  title: string,
  setTitle: (title: string) => void,
  addNewTodo: (title: string) => void,
  setNotification: (value: Notifications) => void,
  isAdding: boolean,
}

export const NewTodo:React.FC<Props> = ({
  newTodoField,
  title,
  setTitle,
  addNewTodo,
  setNotification,
  isAdding,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setNotification(Notifications.TitleError);

      setTimeout(() => {
        setNotification(Notifications.None);
      }, 3000);

      return;
    }

    addNewTodo(title);
  };

  useEffect(() => {
    if (!isAdding) {
      setTitle('');
    }
  }, [isAdding]);

  return (
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
  );
};
