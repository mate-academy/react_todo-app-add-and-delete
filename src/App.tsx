import React, { useEffect, useState } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Filter } from './types/filter';
import { Errors } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';
import { getFilteredTodos } from './utils/filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Empty);

  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);

  async function loadTodos() {
    try {
      const currentTodos = await todosService.getTodos();

      setTodos(currentTodos);
    } catch (error) {
      setErrorMessage(Errors.Load);

      throw error;
    }
  }

  async function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    setErrorMessage(Errors.Empty);
    setTempTodo({ id: 0, userId, title, completed });

    try {
      const response = await todosService.addTodos({
        userId,
        title,
        completed,
      });

      setTempTodo(null);
      setTodos(currentTodos => [...currentTodos, response]);
    } catch (error) {
      setErrorMessage(Errors.Add);

      throw error;
    }
  }

  async function deleteTodo(todoId: number) {
    setErrorMessage(Errors.Empty);
    setDeletingTodoIds(ids => [...ids, todoId]);

    try {
      await todosService.deleteTodo(todoId);

      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Errors.Delete);
    } finally {
      setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(Errors.Empty), 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  const todosToDisplay = getFilteredTodos(todos, selectedFilter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSetTitleError={setErrorMessage}
          todos={todos}
          onSubmit={addTodo}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
        />

        <TodoList
          todos={todosToDisplay}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          deletingTodoIds={deletingTodoIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            onDelete={deleteTodo}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
