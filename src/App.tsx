/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';

import { todosApi } from './api/todos';
import { filterTodosByCompleted } from './helpers/helpers';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { useError } from './controllers/useError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState(FilterType.ALL);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const [errorMessage, showError, closeError] = useError();

  useEffect(() => {
    if (user) {
      todosApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Can\'t load todos'));
    }
  }, [user]);

  const addTodo = useCallback(async (fieldsToCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAddingTodo(true);
      setTempTodo({ ...fieldsToCreate, id: 0 });

      const newTodo = await todosApi.addTodo(fieldsToCreate);

      setTodos((prevTodos => [...prevTodos, newTodo]));
    } catch {
      showError('Unable to add todo');

      throw Error('Unable to add todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodoIds((prevIds => [...prevIds, todoId]));

      await todosApi.deleteTodo(todoId);

      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete todo');
    } finally {
      setDeletingTodoIds((prevIds => prevIds.filter(id => id !== todoId)));
    }
  }, []);

  const deleteAllCompleted = useCallback(async () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteTodo(todo.id));
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return filterTodosByCompleted(todos, completedFilter);
  }, [todos, completedFilter]);

  const activeTodosAmount = useMemo(() => {
    return visibleTodos.filter(todo => !todo.completed).length;
  }, [visibleTodos]);

  const completedTodosAmount = useMemo(() => {
    return visibleTodos.filter(todo => todo.completed).length;
  }, [visibleTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          isAddingTodo={isAddingTodo}
          showError={showError}
        />

        {(todos.length || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              deletingTodoIds={deletingTodoIds}
            />

            <Footer
              completedFilter={completedFilter}
              setCompletedFilter={setCompletedFilter}
              deleteAllCompleted={deleteAllCompleted}
              activeTodosAmount={activeTodosAmount}
              completedTodosAmount={completedTodosAmount}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          closeError={closeError}
        />
      )}
    </div>
  );
};
