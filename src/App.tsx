/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Filter } from './components/Filter/Filter';
import { TodoList } from './components/TodoList/TodoList';
import {
  ErrorsContext,
  TodoUpdateContext,
  TodosContext,
  TodosProvider,
} from './TodosContext/TodosContext';
import { InputForm } from './components/InputForm/InputForm';
import { Status } from './types/Status';
import { Error } from './components/Error/Error';

export const USER_ID = 105;

export const AppContent: React.FC = () => {
  const { addTodo, changeTodo, removeTodo } = useContext(TodoUpdateContext);
  const { todos } = useContext(TodosContext);
  const [status, setStatus] = useState<Status>(Status.All);
  const { setShowError } = useContext(ErrorsContext);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const handleSetIsClicked = () => {
    setShowError(false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <InputForm onSubmit={addTodo} onCompleted={changeTodo} />

        <TodoList status={status} />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Filter
            onChangeStatus={handleStatusChange}
            status={status}
            onClearCompleted={removeTodo}
          />
        )}
      </div>
      <Error onIsClicked={handleSetIsClicked} />
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <AppContent />
    </TodosProvider>
  );
};
