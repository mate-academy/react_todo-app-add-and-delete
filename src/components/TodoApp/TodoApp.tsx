import { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { TodoFooter } from '../TodoFooter';
import { TodoHeader } from '../TodoHeader';
import { TodoList } from '../TodoList';
import { TodoErrors } from '../TodoErrors';
import { TodoItem } from '../TodoItem';

export const TodoApp: React.FC = () => {
  const {
    todos,
    errorMessage,
    tempTodo,
  } = useContext(TodosContext);

  const isShowOnlyInput = todos.length === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        {!isShowOnlyInput
          && (
            <>
              <TodoList />
              {tempTodo
                && (
                  <TodoItem
                    todo={tempTodo}
                    isTempTodo
                  />
                )}

              <TodoFooter />
            </>
          )}
      </div>

      {errorMessage
        && (
          <TodoErrors />
        )}
    </div>
  );
};
