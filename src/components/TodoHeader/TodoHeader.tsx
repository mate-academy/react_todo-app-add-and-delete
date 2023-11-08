import React, {
  useState, useRef, useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { addTodos } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void;
  setTodosError: (error: ErrorMessage) => void;
  tempTodos: Todo | null;
  setTempTodos: (value: Todo | null) => void,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  setTodosError,
  tempTodos,
  setTempTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.current) {
      focusedInput.current.focus();
    }
  }, [tempTodos]);

  const isActiveButton = todos.every(todo => todo.completed);

  const addTodoHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setTimeout(() => {
        setTodosError(ErrorMessage.TitleShouldNotBeEmpty);
      }, 3000);

      return;
    }

    setTempTodos({
      id: 0,
      userId: 11859,
      title: todoTitle.trim(),
      completed: false,
    });

    const tempTodo = {
      id: 0,
      userId: 11859,
      title: todoTitle.trim(),
      completed: false,
    };

    try {
      await addTodos(tempTodo);
      setTodos([...todos, tempTodo]);
      setTodoTitle('');
    } catch (error) {
      setTimeout(() => {
        setTodosError(ErrorMessage.UnableToAddTodo);
      }, 3000);
    } finally {
      setTempTodos(null);
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

      {/* eslint-disable jsx-a11y/control-has-associated-label  */}
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

      {/* Add a todo on form submit */}
      <form
        onSubmit={addTodoHandler}
      >
        <input
          disabled={tempTodos !== null}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          ref={focusedInput}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement>,
          ) => setTodoTitle(
            event.target.value,
          )}
        />
      </form>
    </header>
  );
};
