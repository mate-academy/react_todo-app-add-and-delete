import React, { useState } from 'react';

import { postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

const createTodo = (title: string, userId: number) => {
  const newTodo: Omit<Todo, 'id'> = {
    userId,
    title,
    completed: false,
  };

  return newTodo;
};

type Props = {
  userId: number,
  showError: (errorMessage: string) => void,
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
};

export const NewTodoForm: React.FC<Props> = React.memo(({
  userId,
  showError,
  setAllTodos,
  setTempTodo,
}) => {
  const [todoTitle, setTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const postNewTodo = async (title: string) => {
    try {
      const tempTodo: Todo = {
        id: 0,
        userId,
        title,
        completed: false,
      };

      setTempTodo(tempTodo);
      setIsPosting(true);

      const newTodo = createTodo(title, userId);
      const addedTodo = await postTodo(newTodo);

      setAllTodos(prevState => [...prevState, addedTodo]);
      setTempTodo(null);
      setTitle('');
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      setIsPosting(false);
    }
  };

  const handleTItleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  const handleTodoAddition = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      postNewTodo(todoTitle);
    } else {
      showError('Title can\'t be empty');
    }
  };

  window.console.log('rendering new todo form');

  return (
    <form
      onSubmit={handleTodoAddition}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleTItleChange}
        disabled={isPosting}
      />
    </form>
  );
});
