/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState } from 'react';
import { addNewTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { USER_ID } from '../../constants';
import { Todo } from '../../types/Todo';

interface Props {
  onChangeTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  onChangeTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  onChangeError: React.Dispatch<React.SetStateAction<ErrorType>>;
  onChangeProcessing: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: FC<Props> = ({
  onChangeTempTodo,
  onChangeTodos,
  onChangeError,
  onChangeProcessing,
}) => {
  const [newTodoQuery, setNewTodoQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNewTodoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeError(ErrorType.None);
    setNewTodoQuery(event.target.value);
  };

  const handleEnterPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      if (!newTodoQuery.trim()) {
        onChangeError(ErrorType.EmptyTitle);

        return;
      }

      try {
        setIsLoading(true);
        onChangeTempTodo({
          id: 0,
          userId: USER_ID,
          title: newTodoQuery,
          completed: false,
        });

        onChangeProcessing(prev => [...prev, 0]);

        const newTodo = await addNewTodo(USER_ID, newTodoQuery);

        onChangeTodos(prev => [...prev, newTodo]);
        setNewTodoQuery('');
      } catch {
        onChangeError(ErrorType.Add);
      } finally {
        setIsLoading(false);
        onChangeTempTodo(null);
      }
    }
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleOnSubmit}>
        <input
          disabled={isLoading}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoQuery}
          onChange={handleNewTodoInput}
          onKeyPress={handleEnterPress}
        />
      </form>
    </header>
  );
};
