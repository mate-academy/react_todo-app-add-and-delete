/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo,
  useCallback,
  useContext, useEffect, useState,
} from 'react';
import { getTodos, creatTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
// eslint-disable-next-line import/no-cycle
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { Todo, FilterTodoComplete } from './types/Todo';

export const App: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoToComplete, setTodoToComplete] = useState(FilterTodoComplete.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [deleteTodoIdFromArray, setDeleteTodoIdFromArray]
    = useState<number[]>([]);

  const showErrorMessage = useCallback((error: string) => {
    setErrorMessage(error);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(todo => (
          setTodos(todo)))
        .catch(() => showErrorMessage('Failed request for todos'));
    }
  }, []);

  const userId = user ? user.id : 0;

  const addTodo = async (todoData: Omit<Todo, 'id'>) => {
    try {
      const tempTodo = {
        ...todoData,
        id: 0,
      };

      setTemporaryTodo(tempTodo);

      const newTodo = await creatTodo(todoData);

      setTodos(currentTodoArray => [...currentTodoArray, newTodo]);
      setTemporaryTodo(null);
    } catch {
      showErrorMessage('Unable to add a todo');
      setTemporaryTodo(null);
    }
  };

  const deleteTodoFromData = async (todoId: number) => {
    try {
      setDeleteTodoIdFromArray(prevList => [...prevList, todoId]);

      const deletedTodo = await deleteTodo(todoId);

      setTodos(oldAttay => oldAttay.filter(todo => todo.id !== todoId));

      setDeleteTodoIdFromArray(prevList => (
        prevList.filter(id => id !== todoId)
      ));

      return deletedTodo;
    } catch {
      setDeleteTodoIdFromArray(prevList => (
        prevList.filter(id => id !== todoId)
      ));
      showErrorMessage('Unable to delete a todo');

      return false;
    }
  };

  const todoFilteredCompleted = useCallback((value: FilterTodoComplete) => {
    switch (value) {
      case FilterTodoComplete.Active:
        return todos.filter(todo => !todo.completed);

      case FilterTodoComplete.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos]);

  const filteredTodosByStatus = todoFilteredCompleted(todoToComplete);

  const todoFilteredStatusCompleted = todos.filter(todo => (
    todo.completed === true
  ));

  const countNotCompletedTodo = todos.filter(todo => !todo.completed);

  const deleteTodosStatusCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed === true) {
        deleteTodoFromData(todo.id);
      }
    });
  }, [todoFilteredStatusCompleted]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSubmit={addTodo}
          title={title}
          setTitle={setTitle}
          showErrorMessage={showErrorMessage}
          userId={userId}
          temporaryTodo={temporaryTodo}
          deleteTodoFromArray={deleteTodoIdFromArray}

        />

        {(todos.length !== 0 || temporaryTodo) && (
          <>
            <TodoList
              todos={filteredTodosByStatus}
              deleteTodoFromData={deleteTodoFromData}
              temporaryTodo={temporaryTodo}
              deleteTodoIdFromArray={deleteTodoIdFromArray}
            />

            <TodoFooter
              todoCompleted={todoToComplete}
              setTodoToComplete={setTodoToComplete}
              listTodoCompletedToDelete={todoFilteredStatusCompleted}
              deleteTodosStatusCompleted={deleteTodosStatusCompleted}
              countNotCompletedTodo={countNotCompletedTodo}
            />
          </>
        )}

        {errorMessage && (
          <ErrorNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>
    </div>
  );
});
