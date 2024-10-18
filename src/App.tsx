/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './component/Header/Header';
import { ToDoList } from './component/TodoList/TodoList';
import { Footer } from './component/Footer/Footer';
import { Errors } from './component/Errors/Errors';
import { GroupStatusTypes } from './types/status';
import { ErrorMessage } from './types/errorMessage';
import { getFilteredTodos } from './utils/todoHelpers';

interface TodoFilterProps {
  filteredStatus?: GroupStatusTypes;
  error?: ErrorMessage;
}

export const App: React.FC<TodoFilterProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(GroupStatusTypes.ALL);
  const [idTodo, setIdTodo] = useState([0]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState({
    userId: USER_ID,
    title: '',
    completed: false,
    id: 0,
  });

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.ERROR))
      .finally(() => {
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  function onDeleteTodo(todoId: number) {
    setIdTodo(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UNABLE_TO_DELETE);
      })
      .finally(() => {
        setIdTodo(prev => prev.filter(id => id !== todoId));
      });
  }

  function onCreateTodo(newToDo: Todo) {
    const todoTrim = { ...newToDo, title: newToDo.title.trim() };

    setTempTodo(todoTrim);

    return createTodo(todoTrim)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UNABLE_TO_ADD);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }

  function handleChangeTitle(value: string) {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: value,
    }));
  }

  function reset() {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: '',
    }));
  }

  const activeTaskAmount = todos.filter(todo => !todo.completed).length;
  const hasComplitedTask = todos.some(todo => todo.completed);

  function clearCompletedTodo() {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        onDeleteTodo(todo.id);
      });
  }

  const filteredTodos = getFilteredTodos(todos, status);
  const currentTodos = [...filteredTodos];

  if (tempTodo) {
    currentTodos.push(tempTodo);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todo={newTodo}
          onSubmit={onCreateTodo}
          onChange={handleChangeTitle}
          onReset={reset}
          onError={setErrorMessage}
        />

        <ToDoList
          todos={currentTodos}
          onDelete={onDeleteTodo}
          idTodo={idTodo}
        />

        {!!todos.length && (
          <Footer
            onClick={setStatus}
            status={status}
            activeTaskAmount={activeTaskAmount}
            completedItems={hasComplitedTask}
            onDelete={clearCompletedTodo}
          />
        )}
      </div>

      <Errors errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
