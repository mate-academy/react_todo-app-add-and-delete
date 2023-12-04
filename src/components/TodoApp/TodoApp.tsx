import { useContext } from 'react';
import { ErrorNotification } from '../ErrorNotification';
import { Footer } from '../Footer';
import { Header } from '../Header/Header';
import { TodoList } from '../TodoList';
import { TodosContext } from '../TodosContext';

/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {};

export const TodoApp: React.FC<Props> = () => {
  const { todos } = useContext(TodosContext);
  const { errorMessage } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>

      {!!errorMessage && (
        <ErrorNotification />
      )}

    </div>
  );
};
