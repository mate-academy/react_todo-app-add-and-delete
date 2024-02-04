import { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';
import { filteredTodos } from '../../services/filterTodos';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp = () => {
  const {
    todos,
    filterTodos,
  } = useContext(TodosContext);

  const filteredItems = filteredTodos(todos, filterTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos && (
          <Main items={filteredItems} />
        )}

        {!!todos.length && (
          <Footer />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification />
    </div>
  );
};
