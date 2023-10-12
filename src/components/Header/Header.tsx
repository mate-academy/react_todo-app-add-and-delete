/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Message } from '../../types/Message';
import { USER_ID } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';

type Props = {
  titleTodo: string,
  setTitleTodo: (t: string) => void,
  setErrorMessage: (m: Message | '') => void,
  onAddTodo: (t: Todo) => void,
  isLoading: boolean,
  setTodos: (t: Todo[]) => void
  todos: Todo[],

};

export const Header: React.FC<Props> = ({
  titleTodo,
  setTitleTodo,
  setErrorMessage,
  onAddTodo,
  isLoading,
  setTodos,
  todos,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleTodo.trim()) {
      setErrorMessage(Message.TitleEmty);

      return;
    }

    // setIsSubmitting(true);

    onAddTodo({
      id: +new Date(),
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    });
  };

  const fieldTitle = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fieldTitle.current) {
      fieldTitle.current.focus();
    }
  }, [isLoading]);

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleChangeStatus = () => {
    setTodos(todos.map(todo => ({
      ...todo,
      completed: !isAllCompleted,
    })));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleChangeStatus}
      />
      <form
        onSubmit={handleAddTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={fieldTitle}
          value={titleTodo}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
