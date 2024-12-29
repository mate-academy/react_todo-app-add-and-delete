/// <reference types='cypress' />

import mixedTodos from '../fixtures/todos.json';

//#region Page Objects
const page = {
  toggleAllButton: () => cy.byDataCy('ToggleAllButton'),
  newTodoField: () => cy.byDataCy('NewTodoField'),
  todosCounter: () => cy.byDataCy('TodosCounter'),
  clearCompletedButton: () => cy.byDataCy('ClearCompletedButton'),

  visit: (url = '/') => {
    cy.visit(url, {
      onBeforeLoad: win => win.localStorage.setItem('user', '{ "id": 1 }'),
    });

    // to wait until React App is loaded
    cy.get('.todoapp__title').should('exist');
  },
  pauseTimers: () => cy.clock(),

  flushJSTimers: (delay = 1000) => {
    cy.clock().then(clock => {
      clock.tick(delay);
      clock.restore();
    });

    cy.wait(50);
  },

  /**
   * @param {*} response - can be a valid response object or stub
   *
   * { body: [] }
   * { statusCode: 503: body: 'Service Unavailable' }
   * spy = cy.stub().callsFake(req => req.reply(response)).as('alias')
   */
  mockLoad: (response = { fixture: 'todos' }) => {
    return cy.intercept('**/todos?userId=*', response);
  },
  mockCreate: (response) => {
    const options = { method: 'POST', url: '**/todos' };

    const spy = cy.stub()
      .callsFake(req => req.reply({
        statusCode: 201,
        body: { ...req.body, id: Math.random() },
      }))
      .as('createCallback');

    return cy.intercept(options, response || spy);
  },
  mockDelete: (id, response) => {
    const options = { method: 'DELETE', url: `**/todos/${id}` };

    return cy.intercept(options, response || { body: '1' });
  },
  mockUpdate: (id, response) => {
    const todo = mixedTodos.find(todo => todo.id === id) || {};
    const options = { method: 'PATCH', url: `**/todos/${id}` };

    const spy = cy.stub()
      .callsFake(req => req.reply({ body: { ...todo, ...req.body, id } }))
      .as('updateCallback');

    return cy.intercept(options, response || spy);
  },
};

const todos = {
  el: index => cy.byDataCy('Todo').eq(index),
  deleteButton: index => todos.el(index).byDataCy('TodoDelete'),
  statusToggler: index => todos.el(index).byDataCy('TodoStatus'),
  title: index => todos.el(index).byDataCy('TodoTitle'),
  titleField: index => todos.el(index).byDataCy('TodoTitleField'),

  assertCount: length => cy.byDataCy('Todo').should('have.length', length),
  assertTitle: (index, title) => todos.title(index).should('have.text', title),
  assertLoading: index => todos.el(index).byDataCy('TodoLoader').should('have.class', 'is-active'),
  assertNotLoading: index => todos.el(index).byDataCy('TodoLoader').should('not.have.class', 'is-active'),
  assertCompleted: index => todos.el(index).should('have.class', 'completed'),
  assertNotCompleted: index => todos.el(index).should('not.have.class', 'completed'),
};

const errorMessage = {
  el: () => cy.byDataCy('ErrorNotification'),
  closeButton: () => errorMessage.el().byDataCy('HideErrorButton'),
  assertVisible: () => errorMessage.el().should('not.have.class', 'hidden'),
  assertHidden: () => errorMessage.el().should('have.class', 'hidden'),
  assertText: text => errorMessage.el().should('have.text', text),
};

const FilterLinkKeys = {
  all: 'FilterLinkAll',
  active: 'FilterLinkActive',
  completed: 'FilterLinkCompleted',
};

const filter = {
  el: () => cy.byDataCy('Filter'),
  link: type => cy.byDataCy(FilterLinkKeys[type]),
  assertVisible: () => filter.el().should('exist'),
  assertHidden: () => filter.el().should('not.exist'),
  assertSelected: type => filter.link(type).should('have.class', 'selected'),
  assertNotSelected: type => filter.link(type).should('not.have.class', 'selected'),
};
//#endregion

let failed = false;

Cypress.on('fail', (e) => {
  failed = true;
  throw e;
});

describe('', () => {
  beforeEach(() => {
    if (failed) Cypress.runner.stop();
  });

  describe('Page with no todos', () => {
    it('should send 1 todos request', () => {
      const spy = cy.stub()
        .callsFake(req => req.reply({ body: [] }))
        .as('loadCallback')

      page.mockLoad(spy).as('loadRequest');
      page.visit();

      cy.wait('@loadRequest');
      cy.wait(500);

      cy.get('@loadCallback').should('have.callCount', 1);
    });

    describe('', () => {
      beforeEach(() => {
        page.mockLoad({ body: [] }).as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should have NewTodoField', () => {
        page.newTodoField().should('exist');
      });

      it('should not have Todos', () => {
        todos.assertCount(0);
      });

      it('should not have Footer', () => {
        filter.assertHidden();
        page.clearCompletedButton().should('not.exist');
        page.todosCounter().should('not.exist');
      });

      it('should not show error message', () => {
        errorMessage.assertHidden();
      });
    });

    describe('on loading error', () => {
      beforeEach(() => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockLoad({ statusCode: 404, body: 'Not found' }).as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should show error', () => {
        errorMessage.assertVisible();
      });

      it('should show correct message', () => {
        errorMessage.assertText('Unable to load todos');
      });

      it('should hide error after 3 seconds', () => {
        // just in case
        cy.wait(50);

        cy.clock();
        cy.tick(2500);
        errorMessage.assertVisible();

        cy.tick(500);
        errorMessage.assertHidden();
      });

      it('should hide error on close button click', () => {
        errorMessage.closeButton().click();
        errorMessage.assertHidden();
      });
    });
  });

  describe('Page with mixed todos', () => {
    beforeEach(() => {
      page.mockLoad().as('loadRequest');
      page.visit();
      cy.wait('@loadRequest');
    });

    it('should have NewTodoField', () => {
      page.newTodoField().should('exist');
    });

    it('should have all loaded todos', () => {
      todos.assertCount(5);
    });

    it('should have delete buttons for every todo', () => {
      todos.deleteButton(0).should('exist');
    });

    it('should not have loaders', () => {
      todos.assertNotLoading(0);
      todos.assertNotLoading(1);
      todos.assertNotLoading(2);
      todos.assertNotLoading(3);
      todos.assertNotLoading(4);
    })

    it('should have correct todo titles', () => {
      todos.assertTitle(0, 'HTML');
      todos.assertTitle(1, 'CSS');
      todos.assertTitle(2, 'JS');
      todos.assertTitle(3, 'TypeScript');
      todos.assertTitle(4, 'React');
    });

    it('should higlight all completed todos', () => {
      todos.assertCompleted(0);
      todos.assertCompleted(1);
      todos.assertCompleted(2);
    });

    it('should not higlight not completed todos', () => {
      todos.assertNotCompleted(3);
      todos.assertNotCompleted(4);
    });

    it('should have correct completed statuses', () => {
      todos.statusToggler(0).should('be.checked');
      todos.statusToggler(1).should('be.checked');
      todos.statusToggler(2).should('be.checked');
      todos.statusToggler(3).should('not.be.checked');
      todos.statusToggler(4).should('not.be.checked');
    });

    it('should have Filter', () => {
      filter.assertVisible();
    });

    it('should have todosCounter with a number of not completed todos', () => {
      page.todosCounter().should('have.text', '2 items left');
    });

    it('should have clearCompletedButton', () => {
      page.clearCompletedButton().should('exist');
    });

    it('should have Filter', () => {
      filter.assertVisible();
    });

    it('should not show error message', () => {
      errorMessage.assertHidden();
    });
  });

  describe('Filtering', () => {
    describe('with mixed todos', () => {
      beforeEach(() => {
        page.mockLoad().as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should have only filterLinkAll active', () => {
        filter.assertSelected('all');
        filter.assertNotSelected('active');
        filter.assertNotSelected('completed');
      });

      it('should allow to select the active filter', () => {
        filter.link('active').click();

        filter.assertNotSelected('all');
        filter.assertSelected('active');
        filter.assertNotSelected('completed');
      });

      it('should show only active todos when active filter is selected', () => {
        filter.link('active').click();

        todos.assertCount(2);
        todos.assertTitle(0, 'TypeScript');
        todos.assertTitle(1, 'React');
      });

      it('should keep footer when active todos are shown', () => {
        filter.link('active').click();

        page.todosCounter().should('have.text', '2 items left');
        filter.assertVisible();
        page.clearCompletedButton().should('exist');
      });

      it('should allow to select the completed filter', () => {
        filter.link('completed').click();

        filter.assertNotSelected('all');
        filter.assertNotSelected('active');
        filter.assertSelected('completed');
      });

      it('should show only completed todos when completed filter is selected', () => {
        filter.link('completed').click();

        todos.assertCount(3);
        todos.assertTitle(0, 'HTML');
        todos.assertTitle(1, 'CSS');
        todos.assertTitle(2, 'JS');
      });

      it('should keep footer when completed todos are shown', () => {
        filter.link('completed').click();

        page.todosCounter().should('have.text', '2 items left');
        filter.assertVisible();
        page.clearCompletedButton().should('exist');
      });

      it('should allow to reset filter', () => {
        filter.link('completed').click();
        filter.link('all').click();

        todos.assertCount(5);
        filter.assertSelected('all');
        filter.assertNotSelected('active');
        filter.assertNotSelected('completed');
      });
    });

    describe('with active todos only', () => {
      beforeEach(() => {
        page.mockLoad({ fixture: 'active-todos' }).as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should hide todos on completed selection', () => {
        filter.link('completed').click();

        todos.assertCount(0);
      });

      it('should keep footer on completed selection', () => {
        filter.link('completed').click();
        filter.assertVisible();
      });

      it('should keep todos counter on completed selection', () => {
        filter.link('completed').click();
        page.todosCounter().should('have.text', '5 items left');
      });
    });

    describe('with completed todos only', () => {
      beforeEach(() => {
        page.mockLoad({ fixture: 'completed-todos' }).as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should hide todos on active selection', () => {
        filter.link('active').click();

        todos.assertCount(0);
      });

      it('should keep footer on active selection', () => {
        filter.link('active').click();
        filter.assertVisible();
      });

      it('should keep todos counter on active selection', () => {
        filter.link('active').click();
        page.todosCounter().should('have.text', '0 items left');
      });
    });
  });

  describe('Adding a todo', () => {
    beforeEach(() => {
      page.mockLoad().as('loadRequest');
      page.visit();
      cy.wait('@loadRequest');
    });

    it('should focus text field by default', () => {
      page.newTodoField().should('be.focused');
    });

    describe('if title is empty', () => {
      beforeEach(() => {
        page.mockCreate();
        page.newTodoField().type('{enter}');
      });

      it('should not send a request', () => {
        cy.get('@createCallback').should('not.be.called');
      });

      it('should keep text field focused', () => {
        page.newTodoField().should('be.focused');
      });

      it('should display an error message', () => {
        errorMessage.assertVisible();
        errorMessage.assertText('Title should not be empty');
      });

      it('should hide an error message after 3 seconds', () => {
        // just in case
        cy.wait(50);

        cy.clock();
        cy.tick(3000);
        errorMessage.assertHidden();
      });
    });

    describe('if title title has only whitespaces', () => {
      beforeEach(() => {
        page.mockCreate();
        page.newTodoField().type('     {enter}');
      });

      it('should not send a request', () => {
        cy.get('@createCallback').should('not.be.called');
      });

      it('should keep text field focused', () => {
        page.newTodoField().should('be.focused');
      });

      it('should display an error message', () => {
        errorMessage.assertVisible();
        errorMessage.assertText('Title should not be empty');
      });

      it('should hide an error message after 3 seconds', () => {
        // just in case
        cy.wait(50);

        cy.clock();
        cy.tick(3000);
        errorMessage.assertHidden();
      });
    });

    describe('after form submition before response is received', () => {
      beforeEach(() => {
        page.mockCreate();
        page.pauseTimers();
        page.newTodoField().type('Test Todo{enter}');
      });

      it('should send a create request', () => {
        cy.tick(1000);
        cy.get('@createCallback').should('have.callCount', 1);
      });

      it('should disable the input', () => {
        page.newTodoField().should('be.disabled');
      });

      it('should keep entered text', () => {
        page.newTodoField().should('have.value', 'Test Todo');
      });

      it('should create and show a temp TodoItem with Loader', () => {
        todos.assertCount(6);
        todos.assertLoading(5);
      });

      it('should show a temp TodoItem with correct title', () => {
        todos.assertTitle(5, 'Test Todo');
      });

      it('should show a not completed temp TodoItem', () => {
        todos.assertNotCompleted(5);
      });

      it('should not show loaders for existing todos', () => {
        todos.assertNotLoading(0);
        todos.assertNotLoading(1);
        todos.assertNotLoading(2);
        todos.assertNotLoading(3);
        todos.assertNotLoading(4);
      });

      it('should not update active counter', () => {
        page.todosCounter().should('have.text', '2 items left');
      });
    });

    describe('on success response', () => {
      describe('', () => {
        beforeEach(() => {
          page.mockCreate().as('createRequest');
          page.newTodoField().type('Test Todo{enter}');

          cy.wait('@createRequest');
        });

        // this test may be flaky
        it.skip('should replace loader with a created todo', () => {
          page.flushJSTimers();
          todos.assertCount(6);
          todos.assertNotLoading(5);
        });

        it('should add a todo with a correct title', () => {
          todos.assertTitle(5, 'Test Todo');
        });

        it('should add a not completed todo', () => {
          todos.assertNotCompleted(5);
        });

        it('should update active counter', () => {
          page.todosCounter().should('have.text', '3 items left');
        });

        it('should enable the text field', () => {
          page.newTodoField().should('not.be.disabled');
        });

        it('should not show error message', () => {
          errorMessage.assertHidden();
        });

        it('should clear text field', () => {
          page.newTodoField().should('have.value', '');
        });

        it('should focus text field', () => {
          page.newTodoField().should('be.focused');
        });

        it('should allow to add one more todo', () => {
          page.mockCreate().as('createRequest2');

          page.newTodoField().type('Hello world{enter}');
          cy.wait('@createRequest2');
          page.flushJSTimers();

          todos.assertCount(7);
          // todos.assertNotLoading(6);
          todos.assertNotCompleted(6);
          todos.assertTitle(6, 'Hello world');
          page.todosCounter().should('have.text', '4 items left');
        });
      });

      it('should add trimmed title', () => {
        page.mockCreate().as('createRequest');

        page.newTodoField().type('  Other Title    {enter}');
        cy.wait('@createRequest');

        // just in case
        page.flushJSTimers();

        todos.assertTitle(5, 'Other Title');
      });

      it('should keep current filter', () => {
        page.mockCreate().as('createRequest');

        filter.link('active').click();
        page.newTodoField().type('Test Todo{enter}');
        cy.wait('@createRequest');

        filter.assertSelected('active');
      });
    });

    describe('on request fail', () => {
      beforeEach(() => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockCreate({ statusCode: 503, body: 'Service Unavailable' })
          .as('createRequest');

        page.newTodoField().type('Test Todo{enter}');

        cy.wait('@createRequest');
      });

      it('should show an error message', () => {
        errorMessage.assertVisible();
        errorMessage.assertText('Unable to add a todo');
      });

      it('should hide an error message in 3 seconds', () => {
        // just in case
        cy.wait(50);

        cy.clock();
        cy.tick(2500);

        errorMessage.assertVisible();

        cy.tick(500);
        errorMessage.assertHidden();
      });

      it('should remove a temp TodoItem on request fail', () => {
        todos.assertCount(5);
        todos.assertTitle(4, 'React');
      });

      it('should enable the text field on request fail', () => {
        page.newTodoField().should('not.be.disabled');
      });

      it('should keep the entered text on request fail', () => {
        page.newTodoField().should('have.value', 'Test Todo');
      });

      it('should focus text field', () => {
        page.newTodoField().should('be.focused');
      });

      it('should not update active counter', () => {
        page.todosCounter().should('have.text', '2 items left');
      });

      it('should immediately hide an error message on new request', () => {
        page.newTodoField().type(`{enter}`);
        errorMessage.assertHidden();
      });

      it('should show an error message again on a next fail', () => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockCreate({ statusCode: 503, body: 'Service Unavailable' })
          .as('createRequest2');

        page.newTodoField().type(`{enter}`);
        cy.wait('@createRequest2');

        errorMessage.assertVisible();
      });

      it('should keep an error message for 3s after the last fail', () => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockCreate({ statusCode: 503, body: 'Service Unavailable' })
          .as('createRequest2');

        cy.clock();

        cy.tick(2000);
        page.newTodoField().type(`{enter}`);
        cy.tick(500);
        cy.wait('@createRequest2');
        cy.tick(2000);

        errorMessage.assertVisible();
      });

      it('should allow to add a todo', () => {
        page.mockCreate().as('createRequest2');
        page.newTodoField().type('{enter}');

        cy.wait('@createRequest2');
        page.flushJSTimers();

        todos.assertCount(6);
        // todos.assertNotLoading(5);
        todos.assertNotCompleted(5);
        todos.assertTitle(5, 'Test Todo');

        page.todosCounter().should('have.text', '3 items left');
      });
    });
  });

  describe('Adding a first todo', () => {
    beforeEach(() => {
      page.mockLoad({ body: [] }).as('loadRequest');
      page.visit();
      cy.wait('@loadRequest');

      page.mockCreate().as('createRequest');
      page.newTodoField().type('First todo{enter}');

      cy.wait('@createRequest');
    });

    it('should show a new todos', () => {
      todos.assertCount(1);
      todos.assertTitle(0, 'First todo');
      todos.assertNotCompleted(0);
    });

    it('should show Filter', () => {
      filter.assertVisible();
    });

    it('should show todosCounter', () => {
      page.todosCounter().should('contain.text', '1 item');
    });
  });

  describe('Individual Todo Deletion', () => {
    describe('Default behavior', () => {
      beforeEach(() => {
        page.mockLoad().as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should display a loader on the todo when the TodoDeleteButton is clicked', () => {
        page.mockDelete(257334);
        page.pauseTimers();
        todos.deleteButton(0).click();

        todos.assertLoading(0);
      });

      it('should not delete a todo before successful response', () => {
        page.mockDelete(257334);
        page.pauseTimers();
        todos.deleteButton(0).click();

        todos.assertCount(5);
      });

      it('should remove the todo from the list on a successful API response', () => {
        page.mockDelete(257334).as('deleteRequest');

        todos.deleteButton(0).click();
        cy.wait('@deleteRequest');

        todos.assertCount(4);
        todos.assertTitle(0, 'CSS');
      });

      it('should focus text field after todo deletion', () => {
        page.mockDelete(257334).as('deleteRequest');

        todos.deleteButton(0).click();
        cy.wait('@deleteRequest');

        page.newTodoField().should('be.focused');
      });

      it('should not remove the todo from the list on an API error', () => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockDelete(257334, { statusCode: 500, body: 'Internal Server Error' }).as('deleteRequest');

        todos.deleteButton(0).click();
        cy.wait('@deleteRequest');

        todos.assertCount(5);
        todos.assertTitle(0, 'HTML');
      });

      it('should show an error message on an API error', () => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockDelete(257334, { statusCode: 500, body: 'Internal Server Error' }).as('deleteRequest');

        todos.deleteButton(0).click();
        cy.wait('@deleteRequest');

        errorMessage.assertVisible();
        errorMessage.assertText('Unable to delete a todo');
      });

      it('should adjust the active todo count correctly after successful deletion', () => {
        page.mockDelete(257338).as('deleteRequest');
        todos.deleteButton(4).click();
        cy.wait('@deleteRequest');

        page.todosCounter().should('contain.text', '1 item');
      });

      it('should not adjust the active todo count after failed deletion', () => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockDelete(257338, { statusCode: 500, body: 'Internal Server Error' })
          .as('deleteRequest');

        todos.deleteButton(4).click();
        cy.wait('@deleteRequest');

        page.todosCounter().should('have.text', '2 items left');
      });
    });

    describe('Last todo deletion', () => {
      beforeEach(() => {
        const todo = {
          "id": 257334,
          "createdAt": "2023-09-19T08:21:56.486Z",
          "updatedAt": "2023-09-19T08:23:07.096Z",
          "userId": 1,
          "title": "HTML",
          "completed": false
        };

        page.mockLoad({ body: [todo] }).as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');

        page.mockDelete(257334);
        todos.deleteButton(0).click();
      });

      it('should hide todos', () => {
        todos.assertCount(0);
      });

      it('should hide footer', () => {
        filter.assertHidden();
        page.clearCompletedButton().should('not.exist');
        page.todosCounter().should('not.exist');
      });

      it('should focus text field after todo deletion', () => {
        page.newTodoField().should('be.focused');
      });
    });
  });

  describe('Group Todo Deletion', () => {
    describe('with no completed todos', () => {
      beforeEach(() => {
        page.mockLoad({ fixture: 'active-todos' }).as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should not have active ClearCompleted button', () => {
        page.clearCompletedButton().should('be.disabled');
      });
    });

    describe('with some completed todos', () => {
      beforeEach(() => {
        page.mockLoad().as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');
      });

      it('should have ClearCompleted button enabled', () => {
        page.clearCompletedButton().should('not.be.disabled');
      });

      it('should send individual deletion request for each completed todo', () => {
        page.mockDelete(257334).as('deleteRequest1');
        page.mockDelete(257335).as('deleteRequest2');
        page.mockDelete(257336).as('deleteRequest3');

        page.clearCompletedButton().click();

        cy.wait('@deleteRequest1');
        cy.wait('@deleteRequest2');
        cy.wait('@deleteRequest3');
      });

      describe('on success', () => {
        beforeEach(() => {
          page.mockDelete(257334).as('deleteRequest1');
          page.mockDelete(257335).as('deleteRequest2');
          page.mockDelete(257336).as('deleteRequest3');

          page.clearCompletedButton().click();

          cy.wait('@deleteRequest1');
          cy.wait('@deleteRequest2');
          cy.wait('@deleteRequest3');
        });

        it('should remove all completed todos from the list', () => {
          todos.assertCount(2);
          todos.assertTitle(0, 'TypeScript');
          todos.assertTitle(1, 'React');
        });

        it('should disable ClearCompleted button', () => {
          page.clearCompletedButton().should('be.disabled');
        });

        it('should focus the text field', () => {
          page.newTodoField().should('be.focused');
        });
      });

      describe('on a single fail', () => {
        beforeEach(() => {
          // to prevent Cypress from failing the test on uncaught exception
          cy.once('uncaught:exception', () => false);

          page.mockDelete(257334).as('deleteRequest1');
          page.mockDelete(257335, { statusCode: 500, body: 'Internal Server Error' }).as('deleteRequest2');
          page.mockDelete(257336).as('deleteRequest3');

          page.clearCompletedButton().click();

          cy.wait('@deleteRequest1');
          cy.wait('@deleteRequest2');
          cy.wait('@deleteRequest3');
        });

        it('should show an error message if any of the group deletions fails', () => {
          errorMessage.assertVisible();
          errorMessage.assertText('Unable to delete a todo');
        });

        it('should remove todos with success responses and keep todos with errors', () => {
          todos.assertCount(3);
          todos.assertTitle(0, 'CSS');
          todos.assertTitle(1, 'TypeScript');
        });

        it('should not disable ClearCompleted button', () => {
          page.clearCompletedButton().should('not.be.disabled');
        });
      });
    });

    describe('with all todos completed', () => {
      beforeEach(() => {
        page.mockLoad({ fixture: 'completed-todos' }).as('loadRequest');
        page.visit();
        cy.wait('@loadRequest');

        page.mockDelete(257334).as('deleteRequest1');
        page.mockDelete(257335).as('deleteRequest2');
        page.mockDelete(257336).as('deleteRequest3');
        page.mockDelete(257337).as('deleteRequest4');
        page.mockDelete(257338).as('deleteRequest5');

        page.clearCompletedButton().click();

        cy.wait('@deleteRequest1');
        cy.wait('@deleteRequest2');
        cy.wait('@deleteRequest3');
        cy.wait('@deleteRequest4');
        cy.wait('@deleteRequest5');
      });

      it('should hide todos after clearing all completed todos', () => {
        todos.assertCount(0);
      });

      it('should hide footer after clearing all completed todos', () => {
        filter.assertHidden();
        page.clearCompletedButton().should('not.exist');
        page.todosCounter().should('not.exist');
      });
    });
  });

  describe('Todo Toggling', () => {
    beforeEach(() => {
      page.mockLoad().as('loadRequest');
      page.visit();
      cy.wait('@loadRequest');
    });

    describe('before receving response', () => {
      beforeEach(() => {
        page.mockUpdate(257334).as('updateRequest');
      });

      it('should send an update request', () => {
        todos.statusToggler(0).click();
        cy.wait('@updateRequest');
      });

      it('should show loader after click', () => {
        page.pauseTimers();
        todos.statusToggler(0).click();

        todos.assertLoading(0);
      });

      it('should not show error message after click', () => {
        page.pauseTimers();
        todos.statusToggler(0).click();

        errorMessage.assertHidden();
      });

      it('should not hide a todo if filtered', () => {
        filter.link('completed').click();
        page.pauseTimers();
        cy.tick(1000); // flush JS animation
        todos.statusToggler(0).click();

        todos.assertCount(3);
        todos.assertTitle(0, 'HTML');
      });
    });

    describe('on success', () => {
      beforeEach(() => {
        page.mockUpdate(257334).as('updateRequest');

        todos.statusToggler(0).click();
        cy.wait('@updateRequest');
      });

      it('should toggle a todo', () => {
        todos.assertNotCompleted(0);
        todos.statusToggler(0).should('not.be.checked');
      });

      it('should cancel loading', () => {
        page.flushJSTimers();
        todos.assertNotLoading(0);
      });

      it('should update the counter', () => {
        page.todosCounter().should('have.text', '3 items left');
      });

      it('should not show an error message', () => {
        errorMessage.assertHidden();
      });
    });

    describe('on fail', () => {
      beforeEach(() => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockUpdate(257334, { statusCode: 503, body: 'Service Unavailable' })
          .as('updateRequest');

        todos.statusToggler(0).click();
        cy.wait('@updateRequest');
      });

      it('should show an error', () => {
        errorMessage.assertVisible();
        errorMessage.assertText('Unable to update a todo');
      });

      it('should not toggle a todo', () => {
        todos.assertCompleted(0);
        todos.statusToggler(0).should('be.checked');
      });

      it('should cancel loading', () => {
        page.flushJSTimers();
        todos.assertNotLoading(0);
      });

      it('should not update the counter', () => {
        page.todosCounter().should('have.text', '2 items left');
      });

      it('should allow to toggle again', () => {
        page.mockUpdate(257334).as('updateRequest2');

        todos.statusToggler(0).click();
        cy.wait('@updateRequest2');

        todos.assertNotCompleted(0);
      });
    });

    describe('if filtered', () => {
      beforeEach(() => {
        filter.link('completed').click();
      });

      it('should hide a todo on success', () => {
        page.mockUpdate(257334).as('updateRequest');

        todos.statusToggler(0).click();
        cy.wait('@updateRequest');

        todos.assertCount(2);
        todos.assertTitle(0, 'CSS');
      });

      it('should show a todo on success when selected an oposite filter', () => {
        page.mockUpdate(257334).as('updateRequest');

        todos.statusToggler(0).click();
        filter.link('active').click();
        cy.wait('@updateRequest');

        todos.assertCount(3);
        todos.assertTitle(0, 'HTML');
      });

      it('should not hide a todo on fail', () => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockUpdate(257334, { statusCode: 503, body: 'Service Unavailable' })
          .as('updateRequest');

        todos.statusToggler(0).click();
        cy.wait('@updateRequest');

        todos.assertCount(3);
        todos.assertTitle(0, 'HTML');
      });
    });
  });

  describe('Toggle All Button', () => {
    describe('if there are no todos', () => {
      it('should not be visible while loading todos', () => {
        page.mockLoad({ body: [] }).as('loadRequest');

        page.pauseTimers();
        page.visit();

        page.toggleAllButton().should('not.exist');
      });

      it('should not be visible when loaded', () => {
        page.mockLoad({ body: [] }).as('loadRequest');

        page.visit();
        cy.wait('@loadRequest');

        page.toggleAllButton().should('not.exist');
      });

      it('should appear after adding a todo', () => {
        page.mockLoad({ body: [] }).as('loadRequest');
        page.mockCreate().as('createRequest');

        page.visit();
        cy.wait('@loadRequest');

        page.newTodoField().type('First todo{enter}');
        cy.wait('@createRequest');

        page.toggleAllButton().should('exist');
      });

      it('should disappear after removing the last todo', () => {
        const todo = {
          "id": 257334,
          "createdAt": "2023-09-19T08:21:56.486Z",
          "updatedAt": "2023-09-19T08:23:07.096Z",
          "userId": 1,
          "title": "HTML",
          "completed": false
        };

        page.mockLoad({ body: [todo] }).as('loadRequest');
        page.mockDelete(257334).as('deleteRequest');

        page.visit();
        cy.wait('@loadRequest');

        todos.deleteButton(0).click();
        cy.wait('@deleteRequest');

        page.toggleAllButton().should('not.exist');
      });
    });

    describe('if all todos are completed', () => {
      beforeEach(() => {
        page.mockLoad({ fixture: 'completed-todos' }).as('loadRequest');

        page.visit();
        cy.wait('@loadRequest');
      });

      it('should be visible', () => {
        page.toggleAllButton().should('exist');
      });

      it('should stay visible after filtering out all the todos', () => {
        filter.link('active').click();

        page.toggleAllButton().should('exist');
      });

      it('should be active', () => {
        page.toggleAllButton().should('have.class', 'active');
      });

      it('should become not active after toggling a todo', () => {
        page.mockUpdate(257335).as('updateRequest');
        todos.statusToggler(1).click();
        cy.wait('@updateRequest');

        page.toggleAllButton().should('not.have.class', 'active');
      });

      it('should stay active after a todo toggling fail', () => {
        // to prevent Cypress from failing the test on uncaught exception
        cy.once('uncaught:exception', () => false);

        page.mockUpdate(257335, { statusCode: 503 }).as('updateRequest');
        todos.statusToggler(1).click();
        cy.wait('@updateRequest');

        page.toggleAllButton().should('have.class', 'active');
      });

      describe('on click', () => {
        beforeEach(() => {
          page.mockUpdate(257334).as('updateRequest4');
          page.mockUpdate(257335).as('updateRequest5');
          page.mockUpdate(257336).as('updateRequest6');
          page.mockUpdate(257337).as('updateRequest7');
          page.mockUpdate(257338).as('updateRequest8');

          page.toggleAllButton().click();

          cy.wait('@updateRequest4');
          cy.wait('@updateRequest5');
          cy.wait('@updateRequest6');
          cy.wait('@updateRequest7');
          cy.wait('@updateRequest8');
        });

        it('should send requests for all todos', () => {
          // if before each pass
        });

        it('should make all todos active', () => {
          todos.assertNotCompleted(0);
          todos.assertNotCompleted(1);
          todos.assertNotCompleted(2);
          todos.assertNotCompleted(3);
          todos.assertNotCompleted(4);
        });

        it('should become not active', () => {
          page.toggleAllButton().should('not.have.class', 'active');
        });
      });
    });

    describe('if all todos are active', () => {
      beforeEach(() => {
        page.mockLoad({ fixture: 'active-todos' }).as('loadRequest');

        page.visit();
        cy.wait('@loadRequest');
      });

      it('should be visible', () => {
        page.toggleAllButton().should('exist');
      });

      it('should not be active', () => {
        page.toggleAllButton().should('not.have.class', 'active');
      });

      it('should not become active after toggling a todo', () => {
        page.mockUpdate(257335).as('updateRequest');
        todos.statusToggler(1).click();
        cy.wait('@updateRequest');

        page.toggleAllButton().should('not.have.class', 'active');
      });

      describe('on click', () => {
        beforeEach(() => {
          page.mockUpdate(257334).as('updateRequest4');
          page.mockUpdate(257335).as('updateRequest5');
          page.mockUpdate(257336).as('updateRequest6');
          page.mockUpdate(257337).as('updateRequest7');
          page.mockUpdate(257338).as('updateRequest8');

          page.toggleAllButton().click();

          cy.wait('@updateRequest4');
          cy.wait('@updateRequest5');
          cy.wait('@updateRequest6');
          cy.wait('@updateRequest7');
          cy.wait('@updateRequest8');
        });

        it('should send requests for all todos', () => {
          // if before each pass
        });

        it('should make all todos completed', () => {
          todos.assertCompleted(0);
          todos.assertCompleted(1);
          todos.assertCompleted(2);
          todos.assertCompleted(3);
          todos.assertCompleted(4);
        });

        it('should become active', () => {
          page.toggleAllButton().should('have.class', 'active');
        });
      });
    });

    describe('if there are some mixed todos', () => {
      beforeEach(() => {
        page.mockLoad().as('loadRequest');

        page.visit();
        cy.wait('@loadRequest');
      });

      it('should be visible', () => {
        page.toggleAllButton().should('exist');
      });

      it('should not be active', () => {
        page.toggleAllButton().should('not.have.class', 'active');
      });

      it('should become active after completing all todos', () => {
        page.mockUpdate(257337).as('updateRequest1');
        page.mockUpdate(257338).as('updateRequest2');

        todos.statusToggler(3).click();
        cy.wait('@updateRequest1');
        todos.statusToggler(4).click();
        cy.wait('@updateRequest2');

        page.toggleAllButton().should('have.class', 'active');
      });

      describe('on click', () => {
        beforeEach(() => {
          page.mockUpdate(257334, cy.stub().as('update4'));
          page.mockUpdate(257335, cy.stub().as('update5'));
          page.mockUpdate(257336, cy.stub().as('update6'));
          page.mockUpdate(257337).as('updateRequest7');
          page.mockUpdate(257338).as('updateRequest8');

          page.toggleAllButton().click();

          cy.wait('@updateRequest7');
          cy.wait('@updateRequest8');
        });

        it('should send requests only for not completed todos', () => {
          cy.get('@update4').should('not.be.called');
          cy.get('@update5').should('not.be.called');
          cy.get('@update6').should('not.be.called');
        });

        it('should make all todos completed', () => {
          todos.assertCompleted(0);
          todos.assertCompleted(1);
          todos.assertCompleted(2);
          todos.assertCompleted(3);
          todos.assertCompleted(4);
        });

        it('should become active', () => {
          page.toggleAllButton().should('have.class', 'active');
        });
      });
    });
  });

  describe('Renaming', () => {
    beforeEach(() => {
      page.mockLoad().as('loadRequest');
      page.visit();
      cy.wait('@loadRequest');
    });

    it('should not show forms by default', () => {
      todos.titleField(0).should('not.exist');
      todos.titleField(1).should('not.exist');
      todos.titleField(2).should('not.exist');
      todos.titleField(3).should('not.exist');
      todos.titleField(4).should('not.exist');
    });

    describe('Edit Form', () => {
      describe('by default', () => {
        it('should be opened on dblclick', () => {
          todos.title(0).trigger('dblclick');

          todos.titleField(0).should('exist');
        });

        it('should have current value', () => {
          todos.title(0).trigger('dblclick');

          todos.titleField(0).should('have.value', 'HTML');
        });

        it('should be focused', () => {
          todos.title(0).trigger('dblclick');

          todos.titleField(0).should('be.focused');
        });

        it('should hide a title', () => {
          todos.title(0).trigger('dblclick');

          todos.title(0).should('not.exist');
        });

        it('should hide DeleteButton', () => {
          todos.title(0).trigger('dblclick');

          todos.deleteButton(0).should('not.exist');
        });

        it('should keep StatusToggler', () => {
          todos.title(0).trigger('dblclick');

          todos.statusToggler(0).should('exist');
        });

        it('should not open forms for other todos', () => {
          todos.title(0).trigger('dblclick');

          todos.titleField(1).should('not.exist');
          todos.titleField(2).should('not.exist');
          todos.titleField(3).should('not.exist');
          todos.titleField(4).should('not.exist');
        });

        it('should not send a request on change', () => {
          const spy = cy.stub()
            .callsFake(req => req.reply({ body: { ...req.body, id: 257334 } }))
            .as('renameCallback');

          page.mockUpdate(257334, spy);

          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('123');

          cy.get('@renameCallback').should('not.be.called');
        });
      });

      describe('on Escape', () => {
        it('should be closed', () => {
          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('123123{esc}');

          todos.titleField(0).should('not.exist');
        });

        it('should keep current title', () => {
          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('123123{esc}');

          todos.assertTitle(0, 'HTML');
        });

        it('should not send a request', () => {
          const spy = cy.stub()
            .callsFake(req => req.reply({ body: { ...req.body, id: 257334 } }))
            .as('renameCallback');

          page.mockUpdate(257334, spy);

          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('123123{esc}');

          cy.get('@renameCallback').should('not.be.called');
        });
      });

      describe('on enter before recieved a response', () => {
        it('should send a request', () => {
          const spy = cy.stub()
            .callsFake(req => req.reply({ body: { ...req.body, id: 257334 } }))
            .as('renameCallback');

          page.mockUpdate(257334, spy);

          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('123{enter}');

          cy.get('@renameCallback').should('have.callCount', 1);
        });

        it('should show loader', () => {
          page.mockUpdate(257334);

          todos.title(0).trigger('dblclick');
          page.pauseTimers();
          todos.titleField(0).type('123{enter}');

          todos.assertLoading(0);
        });

        // It depend on your implementation
        it.skip('should stay while waiting', () => {
          page.mockUpdate(257334);

          todos.title(0).trigger('dblclick');
          page.pauseTimers();
          todos.titleField(0).type('123{enter}');

          todos.titleField(0).should('exist');
        });
      });

      describe('on success', () => {
        beforeEach(() => {
          page.mockUpdate(257334).as('renameRequest');

          todos.title(0).trigger('dblclick');
          todos.titleField(0).clear()
        });

        it('should cancel loading', () => {
          todos.titleField(0).type('123{enter}');
          cy.wait('@renameRequest');
          page.flushJSTimers();

          todos.assertNotLoading(0);
        });

        it('should be closed', () => {
          todos.titleField(0).type('123{enter}');
          cy.wait('@renameRequest');
          page.flushJSTimers();

          todos.titleField(0).should('not.exist');
        });

        it('should show the updated title', () => {
          todos.titleField(0).type('Something{enter}');
          cy.wait('@renameRequest');
          page.flushJSTimers();

          todos.assertTitle(0, 'Something');
        });

        it('should trim the new title', () => {
          todos.titleField(0).type('   Some new title      {enter}');
          cy.wait('@renameRequest');
          page.flushJSTimers();

          todos.assertTitle(0, 'Some new title');
        });
      });

      describe('on fail', () => {
        beforeEach(() => {
          // to prevent Cypress from failing the test on uncaught exception
          cy.once('uncaught:exception', () => false);

          page.mockUpdate(257334, { statusCode: 503 }).as('renameRequest');

          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('123{enter}');
          cy.wait('@renameRequest');
        });

        it('should cancel loading', () => {
          page.flushJSTimers();
          todos.assertNotLoading(0);
        });

        it('should stay open', () => {
          todos.titleField(0).should('exist');
        });

        it('should show error message', () => {
          errorMessage.assertVisible();
          errorMessage.assertText('Unable to update a todo');
        });

        it('should hide error message in 3s', () => {
          page.flushJSTimers(3000);

          errorMessage.assertHidden();
        });
      });

      describe('if title was not changed', () => {
        it('should not send a request on enter', () => {
          const spy = cy.stub()
            .callsFake(req => req.reply({ body: { ...req.body, id: 257334 } }))
            .as('renameCallback');

          page.mockUpdate(257334, spy);

          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('{enter}');

          cy.get('@renameCallback').should('not.be.called');
        });

        it('should be close on enter', () => {
          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('{enter}');

          todos.titleField(0).should('not.exist');
        });

        it('should be closed on Escape', () => {
          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('{esc}');

          todos.titleField(0).should('not.exist');
        });

        it('should preserve current title on save', () => {
          todos.title(0).trigger('dblclick');
          todos.titleField(0).type('{enter}');

          todos.assertTitle(0, 'HTML');
        });
      });

      describe('if title became empty', () => {
        beforeEach(() => {
          const spy = cy.stub()
            .callsFake(req => req.reply({ body: { ...req.body, id: 257334 } }))
            .as('renameCallback');

          page.mockUpdate(257334, spy);

          todos.title(0).trigger('dblclick');
          todos.titleField(0).clear();
        });

        it('should not send an update request on enter', () => {
          page.mockDelete(257334).as('deleteRequest');
          todos.titleField(0).type('{enter}');

          cy.get('@renameCallback').should('not.be.called');
        });

        it('should send a delete request on enter', () => {
          page.mockDelete(257334).as('deleteRequest');
          todos.titleField(0).type('{enter}');

          cy.wait('@deleteRequest');
        });

        it('should show loading on enter', () => {
          page.mockDelete(257334).as('deleteRequest');

          page.pauseTimers();
          todos.titleField(0).type('{enter}');

          todos.assertLoading(0);
        });

        it('should delete a todo on success', () => {
          page.mockDelete(257334).as('deleteRequest');
          todos.titleField(0).type('{enter}');
          cy.wait('@deleteRequest');

          todos.assertCount(4);
          todos.assertTitle(0, 'CSS');
        });

        it('should show deleting error message on fail', () => {
          // to prevent Cypress from failing the test on uncaught exception
          cy.once('uncaught:exception', () => false);

          page.mockDelete(257334, { statusCode: 503 }).as('deleteRequest');

          todos.titleField(0).type('{enter}');
          cy.wait('@deleteRequest');

          errorMessage.assertVisible();
          errorMessage.assertText('Unable to delete a todo')
        });

        // this test may be unstable
        it.skip('should hide loader on fail', () => {
          // to prevent Cypress from failing the test on uncaught exception
          cy.once('uncaught:exception', () => false);

          page.mockDelete(257334, { statusCode: 503 }).as('deleteRequest');

          todos.titleField(0).type('{enter}');
          cy.wait('@deleteRequest');
          page.flushJSTimers();

          todos.assertNotLoading(0);
        });

        it('should stay open on fail', () => {
          // to prevent Cypress from failing the test on uncaught exception
          cy.once('uncaught:exception', () => false);

          page.mockDelete(257334, { statusCode: 503 }).as('deleteRequest');

          todos.titleField(0).type('{enter}');
          cy.wait('@deleteRequest');

          todos.titleField(0).should('exist');
        });

        it('should be closed on Escape', () => {
          todos.titleField(0).type('{esc}');

          todos.titleField(0).should('not.exist');
        });

        it('should preserve current title on close', () => {
          todos.titleField(0).type('{esc}');

          todos.title(0).should('have.text', 'HTML');
        });
      });

      describe('on Blur', () => {
        it('should save', () => {
          page.mockUpdate(257334).as('renameRequest');

          todos.title(0).trigger('dblclick');
          todos.titleField(0).clear()
          todos.titleField(0).type('New title');
          todos.titleField(0).blur();
          cy.wait('@renameRequest');

          // just in case
          page.flushJSTimers();

          todos.assertTitle(0, 'New title');
        });

        it('should cancel if title was not changed', () => {
          const spy = cy.stub()
            .callsFake(req => req.reply({ body: { ...req.body, id: 257334 } }))
            .as('renameCallback');

          page.mockUpdate(257334, spy);

          todos.title(0).trigger('dblclick');
          todos.titleField(0).blur();

          cy.get('@renameCallback').should('not.be.called');
          page.flushJSTimers();
          todos.titleField(0).should('not.exist');
          todos.assertTitle(0, 'HTML');
        });

        it('should delete if title is empty', () => {
          page.mockDelete(257334).as('deleteRequest');

          todos.title(0).trigger('dblclick');
          todos.titleField(0).clear();
          todos.titleField(0).blur();
          cy.wait('@deleteRequest');

          todos.assertCount(4);
          todos.assertTitle(0, 'CSS');
        })
      });
    });
  });
});
