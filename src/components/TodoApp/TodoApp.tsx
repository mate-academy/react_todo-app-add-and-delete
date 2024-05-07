import { useContext } from 'react';

import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { TodoHeader } from '../TodoHeader';

import { getFilteredTodos } from '../../utils/utils';
import { ErrorNotification } from '../ErrorNotification';
import { TodoListContext } from '../../contexts/TodoListContext';

export const TodoApp = () => {
  const { todos, errorMessage, clearErrorMessage, currentFilter, tempTodo } =
    useContext(TodoListContext);
  const filteredTodos = getFilteredTodos(todos, currentFilter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        <TodoList tempTodo={tempTodo} todos={filteredTodos} />

        {!!todos.length && <TodoFooter todos={todos} />}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};
