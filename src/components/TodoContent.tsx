import { FC, useContext, useEffect, useRef, useState } from 'react';
import { TodoContext, TodoDispatch } from '../Context/TodoContext';
import { HeaderTodo } from './HeaderTodo/HeaderTodo';
import { MainTodo } from './MainTodo/MainTodo';
import { FooterTodo } from './FooterTodo/FooterTodo';
import { ErrorsTodo } from './Erorrs/ErrorsTodo';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';

export const TodoContent: FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const { todos } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);

  const timerId = useRef(0);
  const hasTodos = todos.length > 0;

  const showError = (message: string) => {
    window.clearTimeout(timerId.current);

    setErrorMessage(message);

    if (!message) {
      return;
    }

    timerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setLoading(true);
    showError('');
    getTodos()
      .then(todosData => {
        dispatch({ type: 'LOAD_TODOS', payload: todosData });
      })
      .catch(() => {
        showError('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <>
      <div className="todoapp__content">
        <HeaderTodo
          showError={showError}
          setTempTodo={setTempTodo}
          setLoading={setLoading}
          setLoadingAdd={setLoadingAdd}
        />
        {hasTodos && (
          <>
            <MainTodo
              loading={loading}
              loadingAdd={loadingAdd}
              tempTodo={tempTodo}
              showError={showError}
              setLoading={setLoading}
            />

            <FooterTodo showError={showError} setLoading={setLoading} />
          </>
        )}
      </div>

      <ErrorsTodo errorMessage={errorMessage} showError={showError} />
    </>
  );
};
