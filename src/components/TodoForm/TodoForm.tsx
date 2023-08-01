import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  loading: boolean,
  addTodo: (newTodo: Todo) => void,
  userId: number,
  setNotification: (value: string) => void,
  tempTodo: Todo | null,
};

export const TodoForm:React.FC<Props> = React.memo(
  ({
    loading,
    addTodo,
    userId,
    setNotification,
    tempTodo,
  }) => {
    const [title, setTitle] = useState<string>('');

    const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setNotification("Title can't be empty");

        return;
      }

      const newTodo = {
        id: 0,
        title,
        completed: false,
        userId,
      };

      addTodo(newTodo);
      setTitle('');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event?.target.value);
    };

    return (
      <form onSubmit={handlerSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={tempTodo !== null && loading}
        />
      </form>
    );
  },
);
