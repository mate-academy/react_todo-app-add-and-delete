import { useState } from 'react';
import { createTodo } from '../api/todos';

export const TodoContentHeader = () => {
  const [title, setTitle] = useState('');
  const [isHandleRequest, setIsHandleRequest] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      return;
    }

    try {
      setIsHandleRequest(true);
      const tempTodo = await createTodo({
        title,
        completed: false,
        userId: 10875,
      });

      console.log(tempTodo);
    } catch {
      console.log('something went wrong');
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

      {/* Add a todo on form submit */}
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
