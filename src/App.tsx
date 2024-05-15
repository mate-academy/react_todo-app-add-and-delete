/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Header } from './Components/Header/Header';
import { Footer } from './Components/Footer/Footer';
import { TodoList } from './Components/TodoList/TodoList';
import { ErrorNotification } from './Components/ErrorNotification';
import { TodoProvider } from './Context/TodoContext';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoProvider>
        <div className="todoapp__content">
          <Header />
          <TodoList />
          <Footer />
        </div>

        <ErrorNotification />
      </TodoProvider>
    </div>
  );
};
