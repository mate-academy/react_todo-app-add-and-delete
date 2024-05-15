import { FC, useContext } from 'react';

import { Form } from '..';
import { AppContext } from '../../wrappers/AppProvider';

export const Header: FC = () => {
  const { todos } = useContext(AppContext);

  const allCompleted = todos.every(todo => todo.completed === true);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all  ${allCompleted && todos.length > 0 ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />
      <Form />
    </header>
  );
};
