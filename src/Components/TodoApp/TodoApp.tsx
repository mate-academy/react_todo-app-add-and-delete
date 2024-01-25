import { useContext } from 'react';

import { Header } from '../Header';
import { Footer } from '../Footer';
import { Main } from '../Main';
import { Notification } from '../Notification';

import { Context } from '../../Context';

export const TodoApp = () => {
  const { todos, errorMessage } = useContext(Context);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <div>
            <Main />
            <Footer />
          </div>
        )}
      </div>

      {errorMessage.length > 0 && <Notification />}
    </div>
  );
};
