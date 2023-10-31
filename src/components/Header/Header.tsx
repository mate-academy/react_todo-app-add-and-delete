import React, { useRef, useEffect } from 'react';
import { addTodo, getTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  nowLoading: boolean;
  setNowLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  showErrorWithDelay:(errorMessage: string) => void;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  USER_ID: 11719;
};

export const Header: React.FC<Props> = ({
  tempTodo,
  setTempTodo,
  nowLoading,
  setNowLoading,
  setTodos,
  setLoaded,
  showErrorWithDelay,
  inputText,
  setInputText,
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
    const trimmedTitle = inputText.trim();

    if (!inputText.trim()) {
      showErrorWithDelay('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setNowLoading(true);
    setTempTodo(newTodo as Todo);
    if (tempTodo) {
      addTodo(newTodo)

        .then(() => {
          getTodos(USER_ID)
            .then((todo) => {
              setTodos(todo);
              setLoaded(true);
              setNowLoading(false);
              setInputText('');
              setTempTodo(null);
            })
            .catch((fetchError) => {
              setLoaded(false);
              setNowLoading(false);
              showErrorWithDelay('Unable to add a todo');
              throw fetchError;
            });
        });
    }
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
          disabled={nowLoading}
        />
      </form>
    </header>
  );
};
