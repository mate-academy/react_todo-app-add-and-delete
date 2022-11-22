import classNames from 'classnames';
import { FC } from 'react';

type Props = {
  isActiveCondition: boolean,
};

export const Loader: FC<Props> = ({ isActiveCondition }) => (
  <div
    data-cy="TodoLoader"
    className={classNames(
      'modal',
      'overlay',
      {
        'is-active': isActiveCondition,
      },

    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
