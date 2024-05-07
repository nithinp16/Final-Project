describe('Login Test', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'Your App Name',
      testName: 'Login Test',
    });
    cy.visit('http://localhost:4200/login'); // Adjust the URL based on your routing
  });

  afterEach(() => {
    cy.eyesClose();
  });

  it('should load the login page', () => {
    cy.contains('Login').should('be.visible');
    cy.eyesCheckWindow('Login Page');
  });

  it('should allow a user to enter username and password', () => {
    cy.get('[formControlName="username"]').type('user123');
    cy.get('[formControlName="password"]').type('password123');
    cy.get('form').submit();
    cy.url().should('include', '/'); // Update based on expected redirect
    cy.eyesCheckWindow('After Login Submission');
  });
});

describe('Signup Test', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'Your App Name',
      testName: 'Signup Test',
    });
    cy.visit('http://localhost:4200/signUp'); // Adjust the URL based on your routing
  });

  afterEach(() => {
    cy.eyesClose();
  });

  it('should load the signup page', () => {
    cy.url().should('include', '/signUp');
    cy.eyesCheckWindow('Signup Page');
  });

  it('should allow a user to create an account', () => {
    cy.get('[formControlName="username"]').type('newuser123');
    cy.get('[formControlName="password"]').type('newpassword123');
    cy.get('form').submit();
    cy.url().should('include', '/login'); // Update based on expected behavior
    cy.eyesCheckWindow('After Account Creation');
  });
});

describe('Dashboard Test', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'Your App Name',
      testName: 'Dashboard Test',
    });
    cy.visit('http://localhost:4200/dashboard'); // Adjust the URL based on your routing
  });

  afterEach(() => {
    cy.eyesClose();
  });

  it('should display budget and expense charts', () => {
    cy.contains('Budget Chart').should('be.visible');
    cy.contains('Budget Vs Expense').should('be.visible');
    cy.eyesCheckWindow('Dashboard Page');
  });
});

describe('Budget Test', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'Your App Name',
      testName: 'Budget Test',
    });
    cy.visit('http://localhost:4200/budget'); // Adjust the URL based on your routing
  });

  afterEach(() => {
    cy.eyesClose();
  });

  it('should allow adding a new budget', () => {
    cy.contains('Add').click();
    cy.get('[formControlName="category"]').select('Food');
    cy.get('[formControlName="budget"]').type('500');
    cy.get('form').submit();
    cy.contains('500').should('be.visible');
    cy.eyesCheckWindow('Budget Page After Adding Budget');
  });
});
