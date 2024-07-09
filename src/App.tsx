import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [value, setValue] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        // throw new Error('Unable to load todos');
      });
  }, []);

  const handleAddTodo = useCallback((newTodo: Todo) => {
    setTempTodo(newTodo);
    let todosLength = 0;

    addTodo(newTodo)
      .then(newTodoRes => {
        setTodos(prevTodos => [...prevTodos, newTodoRes]);
        todosLength = 1;
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        if (todosLength === 1) {
          setValue('');
        }

        setTempTodo(null);
      });
  }, []);

  const handleDeleteCompletedTodos = () => {
    setIsDelCompleted(true);
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.forEach(value1 => {
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

  const handleDeleteTodo = useCallback((todoID: number) => {
    setDelTodo(todoID);

    deleteTodo(todoID)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoID));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setDelTodo(NaN));
  }, []);

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
          value={value}
          onChangeValue={setValue}
          isDelCompleted={isDelCompleted}
          delTodo={delTodo}
          tempTodo={tempTodo}
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
