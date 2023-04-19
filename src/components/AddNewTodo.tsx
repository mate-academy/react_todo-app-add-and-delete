import React, { useState } from 'react';
import { postTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/userId';

type AddNewTodoProps = {
  showErrorNotification: (error: string) => void,
  setIsAddingNewTodo: React.Dispatch<React.SetStateAction<boolean>>,
  isAddingNewTodo: boolean,
  fetchTodos: () => Promise<void>,
};

export const AddNewTodo: React.FC<AddNewTodoProps> = ({
  showErrorNotification, setIsAddingNewTodo, isAddingNewTodo, fetchTodos,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const handleNewTodoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodoTitle) {
      showErrorNotification("Title can't be empty");

      return;
    }

    try {
      setIsAddingNewTodo(true); // disable input
      const tempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      };

      await postTodos(USER_ID, tempTodo);

      fetchTodos();

      setNewTodoTitle('');
    } catch (error) {
      showErrorNotification('Unable to add a todo');
    } finally {
      setIsAddingNewTodo(false); // enable input
    }
  };

  return (
    <form onSubmit={handleNewTodoSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        disabled={isAddingNewTodo}
      />
    </form>
  );
};
