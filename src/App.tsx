/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { getTodos, createTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { FilterCondition } from './types/FilterCondition';
import { Header } from './components/Main/Header';
import { TodoList } from './components/Main/TodoList';
import { Footer } from './components/Main/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [filterCondition, setFilterCondition] = useState(FilterCondition.ALL);

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

  const getSelected = (allTodos: Todo[]): Todo[] => {
    return allTodos.filter(item => {
      switch (filterCondition) {
        case FilterCondition.ALL:
          return true;

        case FilterCondition.COMPLETED:
          return item.completed === true;

        case FilterCondition.ACTIVE:
          return item.completed === false;

        default: return true;
      }
    });
  };

  const addTodo = async (todoData: Omit<Todo, 'id' | 'userId'>) => {
    const fullTodoData = { ...todoData, userId: user?.id };

    try {
      const newTodo = await createTodo(fullTodoData);

      setTodosList(currentTodos => [...currentTodos, newTodo]);
    } catch (e) {
      window.alert(String(e));
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user?.id)
        .then(getSelected)
        .then(setTodosList)
        .catch(() => {
          setTodosList([]);
          setIsError(true);
          setErrorText('Unable to upload a todo-list');
        });
    }
  }, [filterCondition]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosList={todosList}
          onSubmit={addTodo}
          newTodoField={newTodoField}
          setIsError={setIsError}
          setErrorText={setErrorText}
        />
        <TodoList todosList={todosList} />

        {(todosList.length > 0 || filterCondition !== FilterCondition.ALL) && (
          <Footer
            todosList={todosList}
            filterCondition={filterCondition}
            setFilterCondition={setFilterCondition}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsError(false)}
        />
        {errorText}
        {/* Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
      </div>
    </div>
  );
};
