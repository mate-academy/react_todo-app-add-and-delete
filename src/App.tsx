/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>(Filter.ALL);
  const [typeError, setTypeError] = useState<string>('');
  const [newTitleTodo, setNewTitleTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeletedComplete, setisDeletedComplete]
  = useState<boolean>(false);

  const filteredTodos = [...todos];

  const fetchData = useCallback(async () => {
    if (user) {
      try {
        const inData = await getTodos(user.id);

        setTodos(inData);
      } catch (inError) {
        setIsError(false);
        setTypeError(Errors.ErrGET);
      }
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          onSetIsError={setIsError}
          onSetTypeError={setTypeError}
          userId={user?.id || null}
          toLoad={fetchData}
          newTitleTodo={newTitleTodo}
          onSetNewTitleTodo={setNewTitleTodo}
          isAdding={isAdding}
          onSetIsAdding={setIsAdding}
        />

        <TodoList
          newTitleTodo={newTitleTodo}
          isAdding={isAdding}
          todos={filteredTodos}
          selectedFilter={selectedFilter}
          userId={user?.id || null}
          onSetIsError={setIsError}
          onSetTypeError={setTypeError}
          toLoad={fetchData}
          isDeletedComplete={isDeletedComplete}
        />

        <Footer
          todos={todos}
          onSetFilterGlobal={setSelectedFilter}
          selectedFilter={selectedFilter}
          onSetIsError={setIsError}
          onSetTypeError={setTypeError}
          toLoad={fetchData}
          onSetisDeletedComplete={setisDeletedComplete}
        />
      </div>

      <ErrorNotification
        typeError={typeError}
        isError={isError}
        onSetIsError={setIsError}
      />
    </div>
  );
};
