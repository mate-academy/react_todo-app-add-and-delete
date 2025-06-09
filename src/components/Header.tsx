import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { handleAddTodoApi, USER_ID_G } from '../api/todos';
interface InputFocusProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: (value: boolean) => void;
  setError: (value: string) => void;
  todos: Todo[];
  setTempTodo: (value: Todo | null) => void;
  tempTodo: Todo | null;
}
export const Header: React.FC<InputFocusProps> = ({
  inputRef,
  setTodos,
  setLoading,
  setError,
  todos,
  setTempTodo,
  tempTodo,
}) => {
  const [task, setTask] = useState('');
  const allCompleted = todos.every(todo => todo.completed);
  const handleAddTodo = async () => {
    const trimmedTask = task.trim();

    if (!task.trim()) {
      setError('Title should not be empty');

      return;
    }

    const fakeTodo: Todo = {
      id: 0,
      userId: USER_ID_G,
      title: trimmedTask,
      completed: false,
    };

    try {
      setLoading(true);
      setTempTodo(fakeTodo);
      const newTodo = await handleAddTodoApi(trimmedTask);

      setTodos(prev => [...prev, newTodo]);
      setError('');
      setTask('');
    } catch (err) {
      setError((err as Error).message || 'Unable to add a todo');
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {/* Button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />
      {/* Add a todo on form submit */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={Boolean(tempTodo)}
        />
      </form>
      {/* Display error message if task title is empty */}
    </header>
  );
};
