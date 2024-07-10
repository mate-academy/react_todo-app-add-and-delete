import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import * as todoService from './../api/todos';

type Props = {
  todos: Todo[];
  setValueError: (e: string) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsNotificationHidden: (value: boolean) => void;
  autoHideNotification: () => void;
  onAdd: (todo: Todo) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  setValueError,
  setIsNotificationHidden,
  autoHideNotification,
  onAdd,
  setTempTodo,
  inputRef,
}) => {
  const [valueTitle, setValueTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (valueTitle.trim() === '') {
      setValueError('Title should not be empty');
      setIsNotificationHidden(false);
      autoHideNotification();
      inputRef.current?.focus();

      return;
    }

    const trimmedTitle = valueTitle.trim();
    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: todoService.USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      setIsSubmitting(true);

      const createdTodo = await todoService.createTodo({
        title: trimmedTitle,
        userId: newTodo.userId,
        completed: newTodo.completed,
      });

      onAdd(createdTodo);

      setValueTitle('');
      setTempTodo(null);
      inputRef.current?.focus();
    } catch (error) {
      setValueError('Unable to add a todo');
      setIsNotificationHidden(false);
      autoHideNotification();
      inputRef.current?.focus();
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={valueTitle}
          onChange={e => setValueTitle(e.target.value)}
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
