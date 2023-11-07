/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { Form } from '../Form';

type Props = {
  todosFromServer: Todo[]
};

export const Header: FC<Props> = ({ todosFromServer }) => {
  return (

    <header className="todoapp__header">
      {todosFromServer
        && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
        )}
      <Form />
    </header>
  );
};
