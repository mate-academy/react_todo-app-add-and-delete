/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { TodoApp } from './components/TodoApp';

import { TodoListProvider } from './contexts/TodoListProvider';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoListProvider>
      <TodoApp />
    </TodoListProvider>
  );
};
