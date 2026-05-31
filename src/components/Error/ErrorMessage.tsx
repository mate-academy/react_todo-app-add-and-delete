import cn from 'classnames';

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return <div className={cn({ 'is-hidden': !message.length })}>{message}</div>;
};
