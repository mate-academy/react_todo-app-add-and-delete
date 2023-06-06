/* eslint-disable jsx-a11y/control-has-associated-label */
import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo } from '../api/todos';

interface HeaderProps {
  todos: Todo[],
  userId: number,
  handleTempTodo: (todo: Todo | null) => void,
  handleError: (error: string) => void;
  handleIsUpdating: (status: boolean) => void,
}

export const Header = ({
  todos, userId, handleError, handleTempTodo, handleIsUpdating,
}:HeaderProps) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const hasActive = todos.some(todo => !todo.completed);

  const handleCleaner = () => {
    handleIsUpdating(false);
    setIsDisabled(false);
    setTodoTitle('');
    handleTempTodo(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!todoTitle.length) {
      handleError('Title can\'t be empty');

      return;
    }

    setIsDisabled(true);
    const newTodo: Todo = {
      id: 0,
      userId,
      title: todoTitle,
      completed: false,
    };

    handleIsUpdating(true);
    handleTempTodo(newTodo);
    addTodo(newTodo, userId)
      .then(handleCleaner)
      .catch(() => handleError('Unable to add a todo'));
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasActive && (
        <button type="button" className="todoapp__toggle-all active" />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTodoTitle}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
