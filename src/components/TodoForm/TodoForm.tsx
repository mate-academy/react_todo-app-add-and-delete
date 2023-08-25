import React, { useContext, useState } from 'react';
import * as todoService from '../../api/todos';
import { TodosContext } from '../../TodosContext';
import { Error } from '../../types/Error';
import { USER_ID } from '../../utils/constants';

export const TodoForm: React.FC = () => {
  const { setTodos, setErrorMessage, setTempTodo } = useContext(TodosContext);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newTitle.trim()) {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTitle,
        completed: false,
      });

      const todoToAdd = {
        userId: USER_ID,
        title: newTitle,
        completed: false,
      };

      todoService.addTodo(todoToAdd)
        .then(newTodo => {
          setNewTitle('');
          setTodos(currTodos => [...currTodos, newTodo]);
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

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isSubmitting}
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
    </form>
  );
};
