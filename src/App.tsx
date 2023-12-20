/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilteredBy, filteredTodoList } from './helpers';
import { Errors } from './components/Errors/Errors';
import { ErrorType } from './types/ErorTypes';

const USER_ID = 12036;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilteredBy>(FilteredBy.DefaultType);
  const [errorType, setErorType] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTodo, setIsLoadingTodo] = useState<Todo | null>(null);

  const todosToView = useMemo(
    () => filteredTodoList(todos, filterBy),
    [todos, filterBy],
  );

  const todoToRemove = async (todoId: number) => {
    try {
      setIsLoadingTodo(todos.find(todo => todo.id === todoId) || null);

      await todoService.removeTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErorType(ErrorType.DeleteError);
    }
  };

  const addTodo = async (todoTitle: string) => {
    try {
      setIsLoading(true);
      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      const addedTodo = await todoService.addTodo({
        title: todoTitle,
        completed: false,
        userId: USER_ID,
      });

      setTempTodo(newTempTodo);

      setTodos((currentTodos) => [...currentTodos, addedTodo]);

      setIsLoading(false);
    } catch (error) {
      setErorType(ErrorType.AddError);
    } finally {
      setTempTodo(null);
      setNewTodoTitle('');
      setIsLoading(false);
    }
  };

  const clearCompleted = () => {
    todosToView.forEach(todo => {
      if (todo.completed) {
        todoToRemove(todo.id);
      }
    });

    setErorType(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErorType(null);
        const todosFromServer = await todoService.getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setErorType(ErrorType.LoadError);
      }
    };

    fetchData();
  }, []);

  const closeError = useCallback(() => setErorType(null), []);
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllTodosCompleted}
          onAdd={addTodo}
          onError={setErorType}
          onNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          isLoading={isLoading}
        />

        {todosToView && (
          <TodoList
            todos={todosToView}
            onDelete={todoToRemove}
            todoTemp={tempTodo}
            isProcessing={isLoadingTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            onFilter={setFilterBy}
            todos={todosToView}
            filterBy={filterBy}
            onClear={clearCompleted}
          />
        )}
      </div>
      {errorType
        && (
          <Errors
            error={errorType}
            onClose={closeError}
          />
        )}
    </div>
  );
};
