import classNames from 'classnames';
import { FC, FormEvent, useState } from 'react';
import { addTodo } from '../api/todos';
import { USER_ID } from '../constants/userId';
import { useSelector } from '../providers/TodosContext';

type Props = {
  isSomeActive: boolean
};

export const TodoHeader: FC<Props> = ({ isSomeActive }) => {
  const { updateTodos } = useSelector();

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setInputValue('');

      return;
    }

    setIsLoading(true);

    addTodo({
      title: inputValue,
      userId: USER_ID,
      completed: false,
    }).then(() => {
      setInputValue('');
      updateTodos();
    }).finally(() => setIsLoading(false));
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !isSomeActive,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
