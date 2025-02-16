/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { filterTodos } from './utils/filterTodos';
import { ErrorNotification } from './components/ErrorsNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMesage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [selected, setSelected] = useState('all');

  const countActive = () => {
    return todos.filter(todo => todo.completed === false).length;
  };

  const selectTodoFilter = (filter: string) => {
    setSelected(filter);
  };

  const todosAfterFilter = filterTodos(todos, selected);

  const addTodo = (newTodo: Todo): void => {
    setTodos([...todos, newTodo]);
  };

  const handleErrorMessages = (newErrorMessage = ''): void => {
    setErrorMessage(newErrorMessage);
  };

  const onDelete = async (
    setIsDeleting: React.Dispatch<React.SetStateAction<number>>,
    todoItem: Todo,
  ) => {
    try {
      setIsDeleting(todoItem.id);
      await deleteTodo(todoItem.id).then(() =>
        setTodos(todos.filter(todo => todo.id !== todoItem.id)),
      );
    } catch {
      handleErrorMessages('Unable to delete a todo');
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);

          setTodos(prevState => prevState.filter(el => el.id !== todo.id));
        } catch (err) {
          handleErrorMessages('Unable to delete a todo');
        }
      }),
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodos();

        setTodos(response);
      } catch (error) {
        handleErrorMessages('Unable to load todos');
        // setShowError('');
        // setErrorMessage('Unable to load todos');
      }
    };

    fetchData();
  }, [selected]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          handleErrorMessages={handleErrorMessages}
          setTempTodo={setTempTodo}
        />
        {todos.length > 0 && (
          <Main
            todos={todosAfterFilter}
            tempTodo={tempTodo}
            onDelete={onDelete}
          />
        )}
        {todos.length > 0 && (
          <Footer
            activeCount={countActive}
            selected={selected}
            selectTodoFilter={selectTodoFilter}
            clearCompleted={clearCompleted}
            todos={todos}
          />
        )}
      </div>
      <ErrorNotification
        handleErrorMessages={handleErrorMessages}
        errorMesage={errorMesage}
      />
    </div>
  );
};
