import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodoContext } from './TodoProvider';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';

type Props = {
  setTempTodo: (todo: Todo | null) => void;
};

export const Form: React.FC<Props> = ({ setTempTodo }) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const todoTitleField = useRef<HTMLInputElement>(null);
  const {
    setErrorMessage,
    addTodoHandler,
  } = useContext(TodoContext);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target.value);

    if (titleError) {
      setTitleError(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmiting(true);
    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');
      setIsSubmiting(false);

      return;
    }

    const newTodo = {
      title: newTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    try {
      await addTodoHandler(newTodo);

      setIsSubmiting(false);

      setTitle('');
      setTempTodo(null);
    } catch (error) {
      setIsSubmiting(false);
      setTempTodo(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={todoTitleField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
        disabled={isSubmiting}
      />
    </form>
  );
};
