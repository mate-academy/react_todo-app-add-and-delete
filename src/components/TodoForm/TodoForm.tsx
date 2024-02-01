import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID, createTodo } from '../../api/todos';

interface Props {
  setError: (errorMessage: string) => void;
  addTodo: (todo: Todo) => void;
  handleTempTodo: (todo: Todo | null) => void;
}

export const TodoForm: React.FC<Props> = (props) => {
  const { setError, addTodo, handleTempTodo } = props;

  const [newTitle, setNewTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  function approveTodoSave(todo: Todo): void {
    addTodo(todo);
    setNewTitle('');
    setDisableInput(false);
    handleTempTodo(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>):void {
    event.preventDefault();

    const value = newTitle.trim();

    if (!value) {
      setError('Title should not be empty');
      setNewTitle('');

      return;
    }

    const todo: Partial<Todo> = {
      title: value,
      completed: false,
      userId: USER_ID,
    };

    setDisableInput(true);
    handleTempTodo({
      id: 0, title: value, completed: false, userId: 0,
    });

    createTodo(todo)
      .then(approveTodoSave)
      .catch();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={disableInput}
      />
    </form>
  );
};
