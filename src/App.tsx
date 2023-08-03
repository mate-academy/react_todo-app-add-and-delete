import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TabsFooter } from './enums/TabsFooter';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShowError } from './components/ShowError';
import { ShowTodos } from './components/ShowTodos';

const USER_ID = 11093;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hiddenError, setHiddenError] = useState(true);
  const [activeTab, setAvtiveTab] = useState<TabsFooter>(TabsFooter.All);
  const [errorMessage, setErrorMessage] = useState('Unable to loada todo');
  const [loading, setLoading] = useState(false);
  const [itemId, setItemId] = useState([0]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => setTodos(res))
      .catch(() => setHiddenError(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setHiddenError={setHiddenError}
          loading={loading}
          setLoading={setLoading}
          setTempTodo={setTempTodo}
        />

        <ShowTodos
          todos={todos}
          activeTab={activeTab}
          setTodos={setTodos}
          loading={loading}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          setHiddenError={setHiddenError}
          setItemId={setItemId}
          itemId={itemId}
          tempTodo={tempTodo}
        />

        <Footer
          todos={todos}
          setAvtiveTab={setAvtiveTab}
          avtiveTab={activeTab}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setHiddenError={setHiddenError}
          setItemId={setItemId}
          setLoading={setLoading}
        />
      </div>

      <ShowError
        hiddenError={hiddenError}
        setHiddenError={setHiddenError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
