/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { UserTodos } from './components/UserTodos/UserTodos';

export const App: React.FC = () => {
  const userId = USER_ID;

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <UserTodos userId={Number(userId)} />
    </div>
  );
};
