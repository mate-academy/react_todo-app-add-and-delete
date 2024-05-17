/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/label-has-associated-control
import React, { FC, useContext, useEffect, useState } from 'react';
import { TodoContext, TodoDispatch } from '../../Context/TodoContext';
import { USER_ID, addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface IProps {
  showError: (err: string) => void;
  setLoadingAdd: (err: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
}

export const FormHeader: FC<IProps> = ({
  showError,
  setTempTodo,
  setLoadingAdd,
}) => {
  const [text, setNewTodo] = useState('');
  const [load, setLoad] = useState(false);
  const { inputRef, handleFocusInput } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);

  useEffect(() => {
    if (!load) {
      handleFocusInput();
    }
  }, [handleFocusInput, load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoad(true);
    setLoadingAdd(true);

    if (!text.trim()) {
      showError('Title should not be empty');
      setLoad(false);
      setLoadingAdd(false);

      return;
    }

    setTempTodo({
      id: crypto.randomUUID(),
      title: text.trim(),
      completed: false,
    });

    const newTodo = {
      id: crypto.randomUUID(),
      userId: USER_ID,
      title: text.trim(),
      completed: false,
    };

    try {
      const todo = await addTodo(newTodo);

      dispatch({ type: 'ADD_TODO', payload: todo });
      showError('');
      setNewTodo('');
      handleFocusInput();
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoad(false);
      setLoadingAdd(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="NewTodo">
        <input
          id="NewTodo"
          data-cy="NewTodoField"
          type="text"
          title="Write new todo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={text}
          disabled={load}
          onChange={e => setNewTodo(e.target.value)}
        />
      </label>
    </form>
  );
};
