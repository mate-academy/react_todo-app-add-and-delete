import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { TodoContext } from '../../context/TodoContext';
import { ErrorContext } from '../../context/ErrorContext';
import { TodoTempContext } from '../../context/TodoTempContext';
import { USER_ID } from '../../utils/variables';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  onHandleActive: (value: boolean) => void;
};

export const TodoHeader: React.FC<Props> = ({ onHandleActive }) => {
  const { todos, setTodos } = useContext(TodoContext);
  const { setTodoTemp } = useContext(TodoTempContext);
  const { errorMessage, setErrorMessage } = useContext(ErrorContext);

  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [todos, errorMessage]);

  const toggleAll = () => {
    setTodos(currentTodos => {
      const todosCopy = [...currentTodos];

      return todosCopy.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }));
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      inputRef?.current?.focus();

      return;
    }

    setTodoTemp({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    setIsInputDisabled(true);
    onHandleActive(true);
    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then((newTodo) => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, newTodo]);
        setIsInputDisabled(false);
        setTitle('');

        setTimeout(() => {
          onHandleActive(false);
        }, 3000);
      })
      .catch(() => {
        setIsInputDisabled(false);
        setErrorMessage('Unable to add a todo');
        inputRef?.current?.focus();
        onHandleActive(true);
      })
      .finally(() => {
        setTodoTemp(null);
        inputRef?.current?.focus();
        onHandleActive(false);
      });

    onHandleActive(true);
  };

  return (
    <header className="todoapp__header">
      {!!todos.filter(({ completed }) => !completed).length && (
        <button
          type="button"
          aria-label="toggle all"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={isInputDisabled}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
