/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef } from 'react';
import { addTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

import { TodoList } from './components/todoList/TodoList';
import { getFilteredData } from './helpers/helpers';
import { FilterTypes } from './enum/FilterTypes';
import { Provider } from './context/context';
import { TodoForm } from './components/todoForm/TodoForm';
import { FilterFooter } from './components/filterFooter/FilterFooter';
import { ErrorSection } from './components/errorSection/ErrorSection';
import { deleteTodoInTodoList } from './hooks/useDeleteTodoFromList';
import { useClearErrorMessage } from './hooks/useClearErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [todoLoadingStates, setTodoLoadingStates] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [errorMessage, setErrorMessage] = React.useState('');

  const [filter, setFilter] = React.useState<FilterTypes>(FilterTypes.All);

  const inputRef = useRef<HTMLInputElement>(null);
  const displayedTodos = getFilteredData(todos, filter);

  const setTodoLoading = (id: number, loading: boolean) => {
    setTodoLoadingStates(prevState => ({ ...prevState, [id]: loading }));
  };

  const handleFilterChange = (filterType: FilterTypes) => {
    setFilter(filterType);
  };

  const addTodoToTodoList = async ({ id, title, completed, userId }: Todo) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setTempTodo({ id, title, completed, userId });
      setTodoLoading(id, true);
      const addedTodo = await addTodo({
        title,
        completed,
        userId,
      });

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setIsLoading(false);
      setTempTodo(null);
      setTodoLoading(id, false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTodoInTodoList(
      id,
      setTodoLoading,
      setErrorMessage,
      setTodos,
      inputRef,
    );
  };

  const deleteCompletedTodos = (completedTodos: Todo[]) => {
    for (const todo of completedTodos) {
      handleDelete(todo.id);
    }
  };

  async function getTodosList() {
    try {
      const todosData = await getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      throw error;
    }
  }

  useEffect(() => {
    getTodosList();
  }, []);

  useClearErrorMessage(errorMessage, setErrorMessage);

  const contextValue = {
    todoLoadingStates,
    setTodoLoading,
    setErrorMessage,
    setTodos,
    handleDelete,
  };

  return (
    <Provider value={contextValue}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoForm
            todos={todos}
            setErrorMessage={setErrorMessage}
            addTodoToTodoList={addTodoToTodoList}
            isLoading={isLoading}
          />

          {todos.length > 0 && (
            <TodoList todoList={displayedTodos} tempTodo={tempTodo} />
          )}

          {todos.length > 0 && (
            <FilterFooter
              todos={todos}
              handleFilterChange={handleFilterChange}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          )}
        </div>

        <ErrorSection
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </Provider>
  );
};
