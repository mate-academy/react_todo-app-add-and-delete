import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodoContext } from './TodoProvider';
import { Todo } from '../types/Todo';

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

  const handleSubmit = async () => {
    setIsSubmiting(true);
    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');
      setIsSubmiting(false);

      return;
    }

    const newTodo = {
      id: 0,
      title: newTitle,
      userId: 11503,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodoHandler(newTodo, () => {
      setTitle('');
      setTempTodo(null);
    });
    setIsSubmiting(false);
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
