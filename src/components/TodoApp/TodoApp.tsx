import { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { USER_ID } from '../../constants/UserId';
import { UserWarning } from '../../UserWarning';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { Error } from '../Error';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  const activeTodosCount = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const completedTodosIds = todos
    .filter(({ completed }) => completed)
    .map(({ id }) => id);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!(todos.length || tempTodo) && <TodoList tempTodo={tempTodo} />}

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosIds={completedTodosIds}
          />
        )}
      </div>

      <Error />
    </div>
  );
};
