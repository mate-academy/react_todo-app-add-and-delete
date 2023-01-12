import { FC } from 'react';
import { useAppSelector } from '../../hooks/useRedux';
import { selectTodos } from '../../store/todos/todosSelectors';
import TodosErrors from './TodosErrors';
import TodosFooter from './TodosFooter';
import TodosHeader from './TodosHeader';
import TodosList from './TodosList';

const Todos:FC = () => {
  const todos = useAppSelector(selectTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader />
        <TodosList />
        {!!todos?.length && (
          <TodosFooter />
        )}
      </div>

      <TodosErrors />
    </div>
  );
};

export default Todos;
