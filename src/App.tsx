import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/Filter';
import { Todo } from './types/Todo';
import { getFilteredTodo } from './utils/functions';

export const tabs: FilterTypes[] = [
  { id: '', title: 'All' },
  { id: 'active', title: 'Active' },
  { id: 'completed', title: 'Completed' },
];

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [hideError, setHideError] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState(tabs[0].id);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  const onTabSelected = (tab: FilterTypes) => {
    setSelectedTabId(tab.id);
  };

  const selectedTab = tabs.find(tab => tab.id === selectedTabId) || tabs[0];

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const todosFromServer = await getTodos(user?.id);

          setIsLoading(false);

          setTodos(todosFromServer);
        }
      } catch (errorFromServer) {
        setError(`${errorFromServer}`);
      }
    };

    fetchData();
  }, []);

  const resultTodo = getFilteredTodo(todos, selectedTab);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            aria-label="ToggleAllButton"
            className="todoapp__toggle-all active"
          />

          <NewTodoForm
            newTodoField={newTodoField}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            setError={setError}
            setTodos={setTodos}
            todos={todos}
            setIsLoading={setIsLoading}
            setTempTitle={setTempTitle}
            user={user}
            isLoading={isLoading}
          />
        </header>
        {todos.length > 0
          && (
            <>
              <TodoList
                todos={resultTodo}
                setTodos={setTodos}
                setError={setError}
                isLoading={isLoading}
                selectedTodoId={selectedTodoId}
                setSelectedTodoId={setSelectedTodoId}
                tempTitle={tempTitle}
              />

              <Footer
                tabs={tabs}
                selectedTabId={selectedTabId}
                onTabSelected={onTabSelected}
                todos={todos}
                setTodos={setTodos}
                setError={setError}
              />
            </>
          )}

      </div>

      <ErrorMessage
        error={error}
        setHideError={setHideError}
        hideError={hideError}
        setError={setError}
      />
    </div>
  );
};
