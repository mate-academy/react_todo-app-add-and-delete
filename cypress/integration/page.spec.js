/// <reference types='cypress' />
/// <reference types='../support' />

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

    cy.wait(100);
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
    const options = { method: 'PATCH', url: `**/todos/${id}` };

    const spy = cy.stub()
      .callsFake(req => req.reply({ body: { ...req.body, id } }))
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

describe.skip('', () => {
  beforeEach(() => {
    // if (failed) Cypress.runner.stop();
  });

  describe('Page with no todos', () => {
    it('should send 1 todos request', () => {
      const spy = cy.stub()
        .callsFake(req => req.reply({ body: [] }))
        .as('loadCallback')

      page.mockLoad(spy).as('loadRequest');
      page.visit();

      cy.wait('@loadRequest');
      cy.wait(1000);

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
    });
  });
});
