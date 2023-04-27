import React, { FC, useState } from 'react';
import { createNewTodo } from '../../api/todos';
import { USER_ID } from '../../constants';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setProcessings: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Header: FC<Props> = ({
  setError, setTempTodo, setTodos, setProcessings,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [newTodoQuery, setNewTodoQuery] = useState('');

  const handleOnNewTodoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError(ErrorType.NONE);
    setNewTodoQuery(event.target.value);
  };

  const onEnterPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      if (!newTodoQuery.trim()) {
        setError(ErrorType.EMPTY);

        return;
      }

      try {
        setLoading(true);
        setTempTodo({
          id: 0,
          userId: USER_ID,
          title: newTodoQuery,
          completed: false,
        });
        setProcessings(prevState => [...prevState, 0]);

        const newTodo = await createNewTodo(USER_ID, newTodoQuery);

        setTodos(prevTodos => ([...prevTodos, newTodo]));
        setNewTodoQuery('');
      } catch (err) {
        setError(ErrorType.ADD);
      } finally {
        setLoading(false);
        setTempTodo(null);
      }
    }
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleOnSubmit}>
        <input
          disabled={isLoading}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoQuery}
          onChange={handleOnNewTodoInputChange}
          onKeyPress={onEnterPress}
        />
      </form>
    </header>
  );
};
