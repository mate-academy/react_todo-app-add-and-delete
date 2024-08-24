/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { addTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

import { TodoList } from './components/todoList/TodoList';
import { getFilteredData } from './helpers/helpers';
import { FilterTypes } from './enum/FilterTypes';
import { TodoForm } from './components/todoForm/TodoForm';
import { FilterFooter } from './components/filterFooter/FilterFooter';
import { ErrorSection } from './components/errorSection/ErrorSection';
import { useTodosContext } from './context/context';

export const App: React.FC = () => {
  const { todos, setTodos, setErrorMessage, setTodoLoading } =
    useTodosContext();

  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<FilterTypes>(FilterTypes.All);

  const displayedTodos = getFilteredData(todos, filter);

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm addTodoToTodoList={addTodoToTodoList} isLoading={isLoading} />

        {todos.length > 0 && (
          <TodoList todoList={displayedTodos} tempTodo={tempTodo} />
        )}

        {todos.length > 0 && (
          <FilterFooter handleFilterChange={handleFilterChange} />
        )}
      </div>

      <ErrorSection />
    </div>
  );
};
