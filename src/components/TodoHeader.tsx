import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { ErrorMessage } from '../App';

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

  const handleAddNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      onError(ErrorMessage.Title);
    } else {
      onAddTodo({
        id: Math.floor(999 + Math.random() * 111),
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      });
      setTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header" onSubmit={handleAddNewTodo}>
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
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
