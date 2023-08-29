import React, { useState } from 'react';
import { useTodo } from '../../../api/useTodo';
import { USER_ID } from '../../../utils/USER_ID';
import * as todoServices from '../../../api/todos';
import { Error } from '../../../types/Error';

export const TodoInput: React.FC = () => {
  const {
    setTodos,
    setErrorMessage,
    setTempTodo,
  } = useTodo();
  const [newTitle, setNewTitle] = useState('');
  const [isSubmited, setSubmited] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmited(true);

    if (newTitle.trim()) {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTitle,
        completed: false,
      });

      const todoAdd = {
        userId: USER_ID,
        title: newTitle,
        completed: false,
      };

      todoServices.addTodo(todoAdd)
        .then(newTodo => {
          setNewTitle('');
          setTodos(currentTodo => [...currentTodo, newTodo]);
        })
        .catch(() => {
          setErrorMessage(Error.Add);
        })
        .finally(() => {
          setTempTodo(null);
        });
    } else {
      setErrorMessage(Error.InvalidTitle);
    }

    setSubmited(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isSubmited}
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
      />
    </form>
  );
};
