/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTodos, USER_ID } from '../../api/todos';
import { Status } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { UserWarning } from '../../UserWarning';
import { Errors } from '../Errors';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';
import { TodosContext } from '../TodosContext/TodosContext';

export const TodoApp: React.FC = () => {
  const [filterSelected, setFilterSelected] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorHidden, setErrorHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { todos, setTodos } = useContext(TodosContext);

  const showErrorCallback = useCallback(() => {
    setErrorHidden(false);

    const timeoutId = setTimeout(() => {
      setErrorHidden(true);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        showErrorCallback();
      });
  }, [showErrorCallback, setTodos]);

  const filteredTodos = useMemo(() => {
    switch (filterSelected) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterSelected, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasTodos = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          callError={showErrorCallback}
          errorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
        />

        <Main
          todos={filteredTodos}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
          showErrorCallback={showErrorCallback}
        />

        {hasTodos && (
          <Footer selected={filterSelected} setSelected={setFilterSelected} />
        )}
      </div>

      <Errors errorMessage={errorMessage} errorHidden={errorHidden} />
    </div>
  );
};
