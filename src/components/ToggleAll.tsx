/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type ToggleAllProps = {
  // define props here
  allTodosCompleted: boolean,
  handleTaggleAll: () => Promise<void>,
};

export const ToggleAll: React.FC<ToggleAllProps> = ({
  allTodosCompleted, handleTaggleAll,
}) => {
  return (
    <button
      type="button"
      className={
        classNames('todoapp__toggle-all',
          { active: allTodosCompleted })
      }
      onClick={handleTaggleAll}
    />
  );
};
