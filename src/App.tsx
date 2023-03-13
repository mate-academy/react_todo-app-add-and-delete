import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoType } from './types/TodoType';
import { Header } from './components/Header';
import { Footer, SortType } from './components/Footer';
import { Section } from './components/Section';

const USER_ID = 6526;

const getReorderedList = (sortType: SortType, list: TodoType[]) => {
  switch (sortType) {
    case SortType.Active:
      return list.filter(item => !item.completed);
    case SortType.Completed:
      return list.filter(item => item.completed);
    default:
      return list;
  }
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [selectedSortType, setSortType] = useState(SortType.All);
  const [isError, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isDisable, setDisable] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoType | null>();
  const [isRemoveAll, setRemoveAll] = useState(false);

  const activeTodos = getReorderedList(SortType.Active, todos);
  const completedTodos = getReorderedList(SortType.Completed, todos);

  const getQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const getError = (text: string) => {
    setError(true);
    setErrorText(text);

    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const actualTodos = await getTodos(USER_ID);

      setTodos(actualTodos);
    } catch (error) {
      getError('upload');
    }
  };

  const addTodoOnServer = async () => {
    setDisable(true);
    try {
      const todo: TodoType = {
        title: query,
        userId: USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(todo);

      await addTodo(USER_ID, query);
      await fetchTodos();

      setQuery('');
      setTempTodo(null);
    } catch (error) {
      setDisable(false);
      setQuery('');
      getError('add');
    } finally {
      setDisable(false);
    }
  };

  const deleteTodoFromServer = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      await fetchTodos();
    } catch (error) {
      getError('Unable to delete a todo');
    } finally {
      setRemoveAll(false);
    }
  };

  const removeAllCompletedTodos = () => {
    completedTodos.map(todo => deleteTodoFromServer(todo.id));
    setRemoveAll(true);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const getSortType = (newSortType: SortType) => {
    setSortType(newSortType);
  };

  const visibleList = useMemo(() => getReorderedList(selectedSortType, todos),
    [selectedSortType, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          activeTodos={activeTodos.length}
          hasTodos={!!todos.length}
          onQuery={getQuery}
          onError={getError}
          onAdd={addTodoOnServer}
          query={query}
          isDisable={isDisable}
        />
        <Section
          todos={visibleList}
          tempTodo={tempTodo}
          onDelete={deleteTodoFromServer}
          isRemoveAll={isRemoveAll}
        />
        {!!todos.length && (
          <Footer
            itemsLeft={activeTodos}
            selectedSortType={selectedSortType}
            onSortType={getSortType}
            onRemoveComletedTodos={removeAllCompletedTodos}
            completedTodos={completedTodos.length}
          />
        )}
      </div>
      <div
        className="notification is-danger is-light has-text-weight-normal"
        hidden={!isError}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError(false)}
        >
          {}
        </button>
        {errorText}
      </div>
    </div>
  );
};
