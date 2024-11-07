// /* eslint-disable jsx-a11y/control-has-associated-label */
// /* eslint-disable jsx-a11y/label-has-associated-control */

import { USER_ID } from './api/todos';
import { Todos } from './components/Todo/Todos';
import { TodosProvider } from './context/TodoContext';
import { UserWarning } from './UserWarning';

export const App = () =>
  !USER_ID ? (
    <UserWarning />
  ) : (
    <TodosProvider>
      <Todos />
    </TodosProvider>
  );
