import { useState } from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  activeTodosCount: number;
  onSubmit: (title: string) => void;
  onEmptyValue: (value: ErrorType) => void;
};

export const Header: React.FC<Props> = ({
  activeTodosCount, onSubmit, onEmptyValue,
}) => {
  const [titleQuery, setTitleQuery] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleQuery.trim()) {
      onEmptyValue(ErrorType.EMPTY);
    } else {
      onSubmit(titleQuery);
      setTitleQuery('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle todos"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !activeTodosCount,
        })}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleQuery}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
