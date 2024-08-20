/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Notification } from './components/Notification/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeletedTodoHasLoader, setIsDeletedTodoHasLoader] = useState(false);
  const areTodosExist = todos.length !== 0;
  const notCompletedTodos = todos.filter(todo => !todo.completed).length;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      return;
    }

    setIsInputDisabled(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    addTodo({ userId: USER_ID, title: todoTitle.trim(), completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsDeletedTodoHasLoader(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(curTodo => curTodo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setIsDeletedTodoHasLoader(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          isInputDisabled={isInputDisabled}
          inputValue={todoTitle}
          setTodoTitle={setTodoTitle}
          handleAddTodo={handleAddTodo}
        />
        {areTodosExist && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
            isDeletedTodoHasLoader={isDeletedTodoHasLoader}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {areTodosExist && (
          <Footer
            notCompletedTodos={notCompletedTodos}
            onFilterChange={setFilter}
            currentFilter={filter}
          />
        )}
      </div>
      <Notification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
