import cn from 'classnames';

import { PostForm } from '../PostForm';
import { Todo } from '../../types/Todo';

type Props = {
  hasEveryCompletedTodo: boolean;
  onSubmit: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (errorMessage: string) => void;
  loading: boolean;
};

export const Header: React.FC<Props> = ({
  hasEveryCompletedTodo,
  onSubmit,
  setErrorMessage,
  loading,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active: hasEveryCompletedTodo,
      })}
      data-cy="ToggleAllButton"
      aria-label="toggle-all-button"
    />

    <PostForm
      onSubmit={onSubmit}
      setErrorMessage={setErrorMessage}
      loading={loading}
    />
  </header>
);
