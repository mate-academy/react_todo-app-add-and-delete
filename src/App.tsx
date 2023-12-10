import { UserWarning } from './UserWarning';
import { TodoApp } from './TodoApp';

const USER_ID = 12010;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return <TodoApp userId={USER_ID} />;
};
