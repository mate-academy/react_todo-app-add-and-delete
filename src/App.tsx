import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [deletedTodo, setDeletedTodo] = useState(NaN);
  const [isDeleteCompleted, setIsDeleteCompleted] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const handleAdd = useCallback((newTodo: Todo) => {
    setTempoTodo(newTodo);
    let todosLength = 0;

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        todosLength = 1;
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToAdd);
      })
      .finally(() => {
        if (todosLength === 1) {
          setTitle('');
        }

        setTempoTodo(null);
      });
  }, []);

  const handleDeleteCompleted = () => {
    setIsDeleteCompleted(true);
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.forEach(val => {
          if (val.status === 'rejected') {
            setErrorMessage(ErrorMessage.UnableToDelete);
          } else {
            setTodos(currentTodos => {
              const todoId = val.value as Todo;

              return currentTodos.filter(todo => todo.id !== todoId.id);
            });
          }
        });
      })
      .finally(() => setIsDeleteCompleted(false));
  };

  const handleDelete = (todoId: number) => {
    setDeletedTodo(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() => setDeletedTodo(NaN));
  };

  const filteredTodos = [...todos].filter(todo => {
    if (filteredStatus === Status.Active) {
      return !todo.completed;
    }

    if (filteredStatus === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleAdd={handleAdd}
          setErrorMessage={setErrorMessage}
          todosLength={todos.length}
          title={title}
          onChangeTitle={setTitle}
          isDeleteCompleted={isDeleteCompleted}
          deletedTodo={deletedTodo}
          tempoTodo={tempoTodo}
        />
        <TodoList
          todos={filteredTodos}
          tempoTodo={tempoTodo}
          deletedTodo={deletedTodo}
          isDeleteCompleted={isDeleteCompleted}
          onDelete={handleDelete}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            isDeleteCompleted={isDeleteCompleted}
            onFilteredStatus={setFilteredStatus}
            filteredStatus={filteredStatus}
            todosCount={activeTodosCount}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <Errors message={errorMessage} clearError={() => setErrorMessage('')} />
    </div>
  );
};
