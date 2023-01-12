import { FC } from 'react';

import classes from './styles.module.scss';

export const GlobalLoader:FC = () => {
  return (
    <div className={classes.loaderWrapper}>
      <div className={classes.loader}>
        <div />
        <div />
      </div>
    </div>
  );
};
