import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../App';
import classNames from 'classnames';

interface TodoHeaderProps {
  onError: (error: string) => void;
  onAddTodo: (newTodo: Todo) => void;
  onCompleted: () => void;
  todos: Todo[];
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  onError,
  onAddTodo,
  onCompleted,
  todos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleEnteredTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitleTodo = event.target.value;

    setTodoTitle(newTitleTodo);
  };

  const handleTodoCheck = () => {
    return todos.every(todo => todo.completed);
  };

  const handleAddNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      onError(ErrorMessage.Title);

      return;
    }

    onAddTodo({ title: todoTitle.trim() } as Todo);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header" onSubmit={handleAddNewTodo}>
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: handleTodoCheck(),
          })}
          data-cy="ToggleAllButton"
          onClick={onCompleted}
        />
      )}

      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleEnteredTodo}
        />
      </form>
    </header>
  );
};
