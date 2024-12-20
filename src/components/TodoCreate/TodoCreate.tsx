import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setTodoList: (todoList: Todo[]) => void;
  sendError: (error: ErrorType) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  todoList: Todo[];
  userId: number;
};

export const TodoCreate: React.FC<Props> = ({
  setTodoList,
  sendError,
  setTempTodo,
  todoList,
  userId,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const addRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addRef.current) {
      addRef.current.focus();
    }
  }, [title, isSubmitting, todoList]);

  // reset form
  const resetForm = () => {
    setTempTodo(null);
    setSubmitting(false);
  };

  // Add new todo
  const addNewTodo = async (newTitle: string) => {
    const tempTodo: Todo = { id: 0, title: newTitle, userId, completed: false };

    setTempTodo(tempTodo);

    setSubmitting(true);

    try {
      const newTodo: Todo = await createTodo({
        title: newTitle,
        userId,
        completed: false,
      });

      setTodoList(currentTodoList => [...currentTodoList, newTodo]);
      setTitle('');
    } catch {
      sendError(ErrorType.ADD_TODO);
    }

    resetForm();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newTitle = title.trim();

    if (newTitle) {
      addNewTodo(newTitle);
    } else {
      sendError(ErrorType.EMPTY_TITLE);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form method="POST" onSubmit={handleSubmit}>
        <input
          ref={addRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
