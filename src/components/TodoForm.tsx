import {
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';

import { TodoError } from '../enums/TodoError';
import { Todo } from '../types/Todo';
import { addTodo } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';
import { FormContext } from '../contexts/FormContext';

export const TodoForm = () => {
  const {
    todos,
    setTodos,
    setError,
    inputRef,
  } = useContext(TodoContext);
  const { setPreparingTodoLabel, setIsCreating } = useContext(FormContext);
  const [todoLabel, setTodoLabel] = useState('');
  const [isBlockedInput, setIsBlockedInput] = useState(false);

  useEffect(() => {
    if (isBlockedInput === false) {
      inputRef.current?.focus();
    }
  }, [isBlockedInput, inputRef]);

  const isActiveButton = todos.every(todo => todo.completed);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (todoLabel.trim()) {
      setPreparingTodoLabel(todoLabel.trim());
      setIsCreating(true);
      setIsBlockedInput(true);
      addTodo({
        userId: 0,
        title: todoLabel.trim(),
        completed: false,
      })
        .then((newTodo) => {
          setTodos((prevState: Todo[]) => [...prevState, newTodo] as Todo[]);
          setTodoLabel('');
        })
        .catch(() => setError(TodoError.Add))
        .finally(() => {
          setIsBlockedInput(false);
          setIsCreating(false);
          setTimeout(() => {
            setError(TodoError.Null);
          }, 3000);
        });
    } else {
      setError(TodoError.Title);

      setTimeout(() => setError(TodoError.Null), 3000);
    }
  };

  const handleButtonClick = () => {
    const changedTodos = todos.map(todo => {
      return todos.every(task => task.completed)
        ? {
          ...todo,
          completed: false,
        }
        : {
          ...todo,
          completed: true,
        };
    });

    setTodos(changedTodos);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isActiveButton },
          )}
          onClick={handleButtonClick}
          data-cy="ToggleAllButton"
        >
          {}
        </button>
      )}

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoLabel}
          ref={inputRef}
          disabled={isBlockedInput}
          onChange={event => setTodoLabel(event.target.value)}
        />
      </form>
    </header>
  );
};
