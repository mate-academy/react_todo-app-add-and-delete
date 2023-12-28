import React, { useContext, useState } from 'react';
import { Header } from './Header/Header';
import { ErrorMessages } from './ErrorMessages/ErrorMessages';
import { TodoList } from './TodoList/TodoList';
import { Footer } from './Footer/Footer';
import { TodosContext } from './TododsContext/TodosContext';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setTempTodo={setTempTodo} />

        {!!todos.length && (
          <>
            <TodoList />

            {tempTodo && (
              <TodoItem todo={tempTodo} />
            )}
            <Footer />
          </>
        )}
      </div>

      <ErrorMessages />
    </div>
  );
};
