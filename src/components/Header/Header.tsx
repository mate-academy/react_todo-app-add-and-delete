import React, { useRef, useEffect } from 'react';
import { addTodo, getTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  showErrorWithDelay:(errorMessage: string) => void
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  generateId: () => number;
  USER_ID: 11719;
};

export const Header: React.FC<Props> = ({
  setTodos,
  setLoading,
  showErrorWithDelay,
  inputText,
  setInputText,
  generateId,
  USER_ID,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputText.trim()) {
      showErrorWithDelay('Title should not be empty');
    }

    const newTodo:Todo = {
      id: generateId(),
      userId: USER_ID,
      title: inputText,
      completed: false,
    };

    addTodo(newTodo)
      .then(() => {
        getTodos(USER_ID)
          .then((todo) => {
            setTodos(todo);
            setLoading(true);
          })
          .catch((fetchError) => {
            setLoading(false);
            showErrorWithDelay('Unable to add a todo');
            throw fetchError;
          });
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      >
        .
      </button>

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={handleInputChange}
          ref={inputRef}
          // autoFocus
        />
      </form>
    </header>
  );
};
