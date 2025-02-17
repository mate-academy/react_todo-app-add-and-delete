import React, { useEffect, useRef, useState } from 'react';
import { ErrorType } from '../../types/Error';
import { USER_ID, addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
}

export const Form: React.FC<Props> = ({
  todos,
  deletingIds,
  setTodos,
  setTempTodo,
  setError,
}) => {
  const formInputRef = useRef<HTMLInputElement>(null);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    formInputRef.current?.focus();
  }, [loading, deletingIds.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normTask = newTask.trim();

    if (!normTask) {
      setError(ErrorType.EmptyTitle);

      return;
    }

    setLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: normTask,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then((todo: Todo) => {
        setTodos([...todos, todo]);
        setNewTask('');
      })
      .catch(() => {
        setError(ErrorType.AddFail);
        setNewTask(newTodo.title);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={handleInputChange}
          ref={formInputRef}
          disabled={loading || !!deletingIds.length}
        />
      </form>
    </header>
  );
};
