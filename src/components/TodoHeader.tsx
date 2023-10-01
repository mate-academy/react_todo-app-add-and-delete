/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { addTodos, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

type Props = {
  userId: number,
  numberOfActiveTodos: number,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setError: React.Dispatch<React.SetStateAction<Error>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  processing: boolean,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>,

};

export const TodoHeader: React.FC<Props> = ({
  userId,
  numberOfActiveTodos,
  setTempTodo,
  setError,
  setTodos,
  processing,
  setProcessing,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle === '') {
      setError(Error.empty);

      return;
    }

    const newTodo = {
      title: todoTitle,
      completed: false,
      userId,
    };

    setTodoTitle('');
    setProcessing(true);

    addTodos(userId, newTodo)
      .then(() => {
        return getTodos(userId)
          .then(setTodos);
      })
      .catch(() => setError(Error.add))
      .finally(() => {
        setTempTodo(null);
        setProcessing(false);
      });

    setTempTodo({
      id: 0,
      ...newTodo,
    });
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={submitHandler}>
        {numberOfActiveTodos !== 0 && (
          <button type="button" className="todoapp__toggle-all active" />
        )}

        <input
          disabled={processing}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
