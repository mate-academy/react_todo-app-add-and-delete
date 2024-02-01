import { useContext } from 'react';
import { Footer } from '../Footer/Footer';
import { TodosList } from '../TodosList/TodosList';
import { ErrorComponent } from '../errorComponent/ErrorComponent';
import { TodosContext } from '../../contexts/TodosContext';
import { prepareTodosList } from '../../services/prepareTodosList';
import { Header } from '../Header/Header';

export const TodoApp = () => {
  const { todos, filterField, tempTodo } = useContext(TodosContext);
  const preparedTodosList = prepareTodosList(todos, filterField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {(!!todos.length || !!tempTodo)
          && <TodosList todos={preparedTodosList} />}

        {!!todos.length
          && <Footer />}
      </div>

      <ErrorComponent />
    </div>
  );
};
