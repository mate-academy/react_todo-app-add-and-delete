import { useState } from 'react';
import { todosApi } from '../api/todos-api';
import { useTodoContext } from '../context/todoContext/useTodoContext';
import { useErrorContext } from '../context/errorContext/useErrorContext';

export const TodoContentHeader = () => {
  const [title, setTitle] = useState('');
  const [isHandleRequest, setIsHandleRequest] = useState(false);
  const { addTodo } = useTodoContext();
  const { notifyAboutError } = useErrorContext();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      notifyAboutError("Title can't be empty");

      return;
    }

    try {
      setIsHandleRequest(true);
      const tempTodo = await todosApi.create({
        title,
        completed: false,
        userId: 10875,
      });

      addTodo(tempTodo);
    } catch {
      notifyAboutError('Unable to add a todo');
    } finally {
      setTitle('');
      setIsHandleRequest(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={submit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isHandleRequest}
        />
      </form>
    </header>
  );
};
