import { FC, useState } from 'react';
import { todosApi } from '../api/todos-api';
import { useTodoContext } from '../context/todoContext/useTodoContext';
import { useErrorContext } from '../context/errorContext/useErrorContext';
import { Todo } from '../types/Todo';

interface TodoContentHeaderProps {
  setTempTodo: (todo: Todo | null) => void
}

export const TodoContentHeader: FC<TodoContentHeaderProps> = (props) => {
  const { setTempTodo } = props;
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
      setTempTodo({
        id: 0,
        title,
        completed: false,
        userId: 0,
      });
      setIsHandleRequest(true);
      const createdTodo = await todosApi.create({
        title,
        completed: false,
        userId: 10875,
      });

      addTodo(createdTodo);
    } catch {
      notifyAboutError('Unable to add a todo');
    } finally {
      setTitle('');
      setTempTodo(null);
      setIsHandleRequest(false);
    }
  };

  return (
    <header className="todoapp__header">
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
