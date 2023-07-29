import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (newTodo: Todo) => void,
  userId: number,
  setNotification: (value: string) => void,
  tempTodo: Todo | null,
  onTempTodo: (todo: Todo | null) => void,
};

export const TodoForm:React.FC<Props> = React.memo(
  ({
    addTodo,
    userId,
    setNotification,
    tempTodo,
    onTempTodo,
  }) => {
    const [title, setTitle] = useState<string>('');

    const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const newTodo = {
        id: 0,
        title,
        completed: false,
        userId,
      };

      addTodo(newTodo);
      onTempTodo(newTodo);
      setTitle('');
    };

    // if (!title) {
    //   setNotification("Title can't be empty");
    // }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event?.target.value);
      if (!event.target.value) {
        setNotification("Title can't be empty");
      } else {
        setNotification('');
      }
    };

    return (
      <form onSubmit={handlerSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={tempTodo !== null}
        />
      </form>
    );
  },
);
