import React, { useContext } from "react";
// import { UserWarning } from './UserWarning';
import { TodoList } from "../../components/TodoList";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Errors } from "../../components/Errors";
import { TodosContext } from "../../components/TodosProvider";
import { FilterType } from "../../types/FilterType";

export const TodoApp: React.FC = () => {
  const { todosFromServer, filter } =
    useContext(TodosContext);
  return (
    <>
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header/>
        <TodoList/>
        {(todosFromServer.length > 0 || filter !== FilterType.all) && (
          <Footer/>
        )}
      </div>
      <Errors/>
    </>
  );
};
