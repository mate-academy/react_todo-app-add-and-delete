import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Filters } from './types';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [delTodo, setDelTodo] = useState(NaN);

  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [isDelCompleted, setIsDelCompleted] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        // throw new Error('Unable to load todos');
      });
  }, []);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      titleField.current &&
      tempTodo === null &&
      Object.is(delTodo, NaN) &&
      isDelCompleted === false
    ) {
      titleField.current.focus();
    }
  }, [tempTodo, delTodo, isDelCompleted]);

  const handleAddTodo = (newTodo: Todo): Promise<Todo | void> => {
    setTempTodo(newTodo);

    return addTodo(newTodo).then(newTodoRes => {
      setTodos(prevTodos => [...prevTodos, newTodoRes]);
    });
  };

  const handleDeleteCompletedTodos = () => {
    setIsDelCompleted(true);
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.map(value1 => {
          if (value1.status === 'rejected') {
            setErrorMessage('Unable to delete a todo');
          } else {
            setTodos(prevTodos => {
              const todoID = value1.value as Todo;

              return prevTodos.filter(todo1 => todo1.id !== todoID.id);
            });
          }
        });
      })
      .finally(() => setIsDelCompleted(false));
  };

  const handleDeleteTodo = (todoID: number) => {
    setDelTodo(todoID);

    deleteTodo(todoID)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoID));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setDelTodo(NaN));
  };

  const filteredTodos = useMemo(() => {
    const filtrTodos = [...todos];

    switch (filter) {
      case Filters.Active:
        return filtrTodos.filter(todo => !todo.completed);

      case Filters.Completed:
        return filtrTodos.filter(todo => todo.completed);

      case Filters.All:
      default:
        return filtrTodos;
    }
  }, [filter, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          titleField={titleField}
          tempTodo={tempTodo}
          onChangeTempTodo={setTempTodo}
          onErrorMessage={setErrorMessage}
          onSubmit={handleAddTodo}
        />

        <TodoList
          todos={filteredTodos}
          delTodo={delTodo}
          isDelCompleted={isDelCompleted}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
        />

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            isDelCompleted={isDelCompleted}
            selectedFilter={filter}
            onChangeFilter={setFilter}
            onDeleteCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseErrorMessage={() => setErrorMessage('')}
      />
    </div>
  );
};
