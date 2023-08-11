import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { ErrorMessage } from '../../enum/ErrorMessages';
import { setErrorWithTimeout } from '../../utils/setError';

type Props = {
  todos: Todo[],
  isLoading: boolean,
  userId: number,
  setTodos: (todos: Todo[]) => void,
  setErrorMessage: (error: ErrorMessage | null) => void,
  setTempTodo: (tempTodo: Todo | null) => void,
  setIsLoading: (status: boolean) => void;

};

export const AddTodo: React.FC<Props> = ({
  userId,
  setErrorMessage,
  setTempTodo,
  setIsLoading,
  isLoading,
  setTodos,
  todos,
}) => {
  const [title, setTitle] = useState('');

  const addTodoToServer = (
    todoTitle: string,
    todoUserId: number,
    completed = false,
  ) => {
    setIsLoading(true);

    createTodo({
      title: todoTitle,
      userId: todoUserId,
      completed,
    })
      .then(todo => setTodos([...todos, todo]))
      .catch(() => setErrorWithTimeout(
        ErrorMessage.Add,
        3000,
        setErrorMessage,
      ))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addTodoToServer(title, userId, false);

    const tempTodo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    setTempTodo(tempTodo);

    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
