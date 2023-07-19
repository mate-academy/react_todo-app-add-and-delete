import React, {
  useCallback, useEffect, useState,
} from 'react';

import { Title } from './components/Title/Title';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { Content } from './components/Content/Content';
import { Todo } from './types/Todo';
import { ErrorMessages } from './enums/ErrorMessages';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { Values } from './enums/values';
import { ErrorState } from './types/ErrorState';

const USER_ID = 11076;

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorState, setErrorState] = useState<ErrorState>(
    { message: ErrorMessages.noError, showError: false },
  );

  const resetErrorMessage = useCallback((clearTimer = false) => {
    const timerId = localStorage.getItem(Values.TimerId);

    if (timerId && clearTimer) {
      setErrorState((prevState) => ({ ...prevState, showError: false }));
      clearTimeout(+timerId);

      return localStorage.removeItem(Values.TimerId);
    }

    const timer = setTimeout(() => {
      setErrorState((prevState) => ({ ...prevState, showError: false }));
    }, 3000);

    return localStorage.setItem(Values.TimerId, String(timer));
  }, []);
  const createNotification = useCallback(
    (message: ErrorMessages) => {
      setErrorState({ message, showError: true });
      resetErrorMessage();
    }, [],
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await getTodos(USER_ID);

        setTodosList(res);
      } catch (e) {
        createNotification(ErrorMessages.fetchAll);
      }
    };

    fetchTodos();
  }, []);

  const createNewTodo = useCallback(async (title: string) => {
    if (!title.length) {
      createNotification(ErrorMessages.emptyValue);

      return;
    }

    setTempTodo({
      id: 0, title, completed: false, userId: USER_ID,
    });

    const dataToServer: Omit<Todo, 'id'> = {
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      const newTodo = await addTodos(dataToServer);

      setTodosList(currentList => [...currentList, newTodo]);
      setTempTodo(null);
    } catch (e) {
      createNotification(ErrorMessages.addError);
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      await deleteTodos(+id);

      setTodosList(list => list.filter(t => t.id !== +id));
    } catch (e) {
      createNotification(ErrorMessages.deleteError);
    }
  }, []);

  const deleteCompletedTodos = useCallback(async () => {
    try {
      const preparedToDelete = todosList.filter(t => t.completed)
        .map(t => deleteTodos(+t.id));

      await Promise.all(preparedToDelete);
      setTodosList(list => list.filter(t => !t.completed));
    } catch (e) {
      createNotification(ErrorMessages.deleteError);
    }
  }, [todosList]);

  return (
    <div className="todoapp">
      <Title />

      <Content
        todos={todosList}
        tempTodo={tempTodo}
        createNewTodo={createNewTodo}
        deleteTodo={deleteTodo}
        deleteAllTodos={deleteCompletedTodos}
      />

      <ErrorNotification
        closeNotification={resetErrorMessage}
        message={errorState.message}
        showMessage={errorState.showError}
      />
    </div>
  );
};
