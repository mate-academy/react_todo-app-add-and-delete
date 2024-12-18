/* eslint-disable max-len */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  todos: Todo[];
  completedTodosCount: number;
  onAddTodo: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorTodos: Dispatch<SetStateAction<ErrorTypes>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = props => {
  const {
    todos,
    completedTodosCount,
    onAddTodo,
    setErrorTodos,
    tempTodo,
    setTempTodo,
  } = props;

  const [todoTitle, setTodoTitle] = useState('');
  const normalizedTitle = todoTitle.trim();

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  });

  const onResetTitle = () => {
    setTodoTitle('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedTitle) {
      setErrorTodos(ErrorTypes.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    });

    try {
      await onAddTodo({
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      });
      onResetTitle();
    } catch (error) {
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.length === completedTodosCount,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputNameRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
