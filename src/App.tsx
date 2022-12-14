/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AddTodo, DeleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotifications/ErrorNotifications';
import { TodosFooter } from './components/TodosComponents/TodosFooter';
import { TodosHeader } from './components/TodosComponents/TodosHeader';
import { TodosList } from './components/TodosComponents/TodosList';
import { ErrorValues } from './types/ErrorValues';
import { FilterValues } from './types/FilterValues';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState(FilterValues.ALL);
  const [errorStatus, setErrorStatus] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(ErrorValues.DEFAULT);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoCurrentId, setTodoCurrentId] = useState(-1);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getErrorStatus = (currentError: ErrorValues) => {
    setErrorMessage(currentError);

    setErrorStatus(true);

    const handleId = setTimeout(() => {
      setErrorStatus(false);

      setErrorMessage(ErrorValues.DEFAULT);
    }, 3000);

    setTimerId(handleId);

    if (timerId) {
      clearTimeout(timerId);
    }
  };

  const setterErrorStatus = (errStatus: boolean) => {
    setErrorStatus(errStatus);
  };

  const setterCurrentId = (currId: number) => {
    setTodoCurrentId(currId);
  };

  const setterOfQuery = (settedQuery: string) => {
    setQuery(settedQuery);
  };

  const ReloadTodos = async () => {
    if (user) {
      try {
        const response = await getTodos(user.id);

        setTodos(response);
      } catch (error) {
        getErrorStatus(ErrorValues.SERVER);
      }
    }
  };

  const AddingTodos = async () => {
    if (user) {
      try {
        setIsAdding(true);

        await AddTodo({
          completed: false,
          title: query,
          userId: user.id,
        });

        await ReloadTodos();

        setQuery('');

        setIsAdding(false);
      } catch (error) {
        setIsAdding(false);
        getErrorStatus(ErrorValues.ADD);
      }
    }
  };

  const DeletingTodo = async (id: number) => {
    try {
      await DeleteTodo(id);
      await ReloadTodos();
    } catch (error) {
      getErrorStatus(ErrorValues.DELETE);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    ReloadTodos();
  }, []);

  const setFilterStatus = (todoStatus: FilterValues) => {
    setTodoFilter(todoStatus);
  };

  let visibleTodos = [...todos];

  if (todoFilter !== FilterValues.ALL) {
    visibleTodos = visibleTodos
      .filter(completedTodo => {
        switch (todoFilter) {
          case (FilterValues.ACTIVE):
            return completedTodo.completed === true;

          case (FilterValues.COMPLETED):
            return completedTodo.completed === false;

          default:
            return 0;
        }
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          newTodoField={newTodoField}
          query={query}
          isAdding={isAdding}
          AddingTodos={AddingTodos}
          getErrorStatus={getErrorStatus}
          onSetterOfQuery={setterOfQuery}
        />

        {todos.length > 0 && user && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodosList
                user={user}
                todos={visibleTodos}
                query={query}
                isAdding={isAdding}
                DeletingTodo={DeletingTodo}
                todoCurrentId={todoCurrentId}
                onTodoCurrentId={setterCurrentId}
              />
            </section>

            <TodosFooter
              todos={visibleTodos}
              todoFilter={todoFilter}
              onFilterByCompleted={setFilterStatus}
            />
          </>
        )}
      </div>

      {errorStatus && timerId && (
        <ErrorNotification
          timerId={timerId}
          ErrorMessage={ErrorMessage}
          onErrorStatus={setterErrorStatus}
        />
      )}
    </div>
  );
};
