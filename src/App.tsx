import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoType } from './types/TodoType';
import { Header } from './components/Header';
import { Footer, FilterType } from './components/Footer';
import { Section } from './components/Section';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 6526;

const getReorderedList = (filterType: FilterType, list: TodoType[]) => {
  switch (filterType) {
    case FilterType.Active:
      return list.filter(item => !item.completed);
    case FilterType.Completed:
      return list.filter(item => item.completed);
    default:
      return list;
  }
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [selectedFilterType, setFilterType] = useState(FilterType.All);
  const [errorText, setErrorText] = useState('');
  const [isDisable, setDisable] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoType | null>();
  const [isRemoveAll, setRemoveAll] = useState(false);

  const activeTodos = getReorderedList(FilterType.Active, todos);
  const completedTodos = getReorderedList(FilterType.Completed, todos);

  const getQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const getError = (text: string) => {
    setErrorText(text);

    setTimeout(() => {
      setErrorText('');
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

  const getFilterType = (newFilterType: FilterType) => {
    setFilterType(newFilterType);
  };

  const visibleList = useMemo(() => getReorderedList(selectedFilterType, todos),
    [selectedFilterType, todos]);

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
            selectedFilterType={selectedFilterType}
            onFilterType={getFilterType}
            onRemoveComletedTodos={removeAllCompletedTodos}
            completedTodos={completedTodos.length}
          />
        )}
      </div>
      <ErrorNotification
        errorText={errorText}
        setErrorText={setErrorText}
      />
    </div>
  );
};
