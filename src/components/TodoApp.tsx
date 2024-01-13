import { useContext } from 'react';
import { TodosContext } from './TodosContext';
import { Main } from './Main';
import { Footer } from './Footer';
import { Header } from './Header';
import { Error } from './Error';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length !== 0 && (
          <>
            <Main />
            <Footer />
          </>
        )}
        <Error />
      </div>
    </div>

  );
};
