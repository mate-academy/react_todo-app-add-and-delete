import React, {
  useState, useRef, useEffect, RefObject,
} from 'react';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';

type Props = {
  USER_ID: number;
  addNewTodo: (item: Todo) => void;
  showErrorNotification: (value: string) => void;
};

export const Form: React.FC<Props> = ({
  USER_ID,
  addNewTodo,
  showErrorNotification,
}) => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const [tempTodo, setTempTodo] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    if (title.trim().length < 1) {
      showErrorNotification('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTodo = {
      // id: +new Date(),
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    createTodo(newTodo)
      .then((todo) => {
        addNewTodo(todo);
        setTitle('');
      })
      .catch(() => showErrorNotification('Unable to add a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleBlur();
    // setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        data-cy="NewTodoField"
        // className={`todoapp__new-todo ${isLoading ? 'loading' : ''}`}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        ref={inputRef}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        disabled={isLoading}
      />
      {/* {isLoading ? <div className="loading-message">Loading...</div> : null} */}
    </form>
  );
};
