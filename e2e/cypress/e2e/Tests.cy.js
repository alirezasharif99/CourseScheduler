describe('Check the liveness of the server', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
  });
});

describe('Search a course and check the correct value', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('cis3760');
    cy.xpath('//*[@id="results-accordion"]/div/div/div/h4'); //xpath for course result
    cy.contains('Software Engineering');
  });
});

describe('Search courses and check the correct values', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('cis37');
    cy.xpath('//*[@id="results-accordion"]/div[2]/h2/button').click(); //xpath for course result
    cy.xpath('//*[@id="results-accordion"]/div[2]/div/div/h4'); //xpath for course result
    cy.contains('Software Engineering');
  });
});

describe('Add a section of a course to schedule and check the timing is correct', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('cis3760');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]/div[1]/div/div[1]'); //xpath for section table
    cy.contains('CIS*3760*0101 - LEC');
  });
});

describe('Add a section, check the timing and then remove the section', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('cis3760');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]/div[1]/div/div[1]'); //xpath for section table
    cy.contains('CIS*3760*0101 - LEC');
    cy.xpath('//*[@id="root"]/div/div/div/div/div[1]/div[1]/form/div/div[1]/button').click(); //xpath for cross to close search bar
    cy.xpath('//*[@id="root"]/div/div/div/div/div[1]/div[2]/ul/li/h5/button/i').click(); //xpath for cross to remove section
  });
});

describe('Add 2 sections of 2 different courses', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('cis3760');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]/div[1]/div/div[1]'); //xpath for section table
    cy.contains('CIS*3760*0101 - LEC');
    cy.xpath('//*[@id="root"]/div/div/div/div/div[1]/div[1]/form/div/div[1]/button').click(); //xpath for cross to close search bar
    cy.get('input.form-control').type('acct1220');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button/i').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[5]/div[1]/div/div[1]');
    cy.contains('ACCT*1220*0101 - LEC');
    cy.xpath('//*[@id="root"]/div/div/div/div/div[1]/div[1]/form/div/div[1]/button').click(); //xpath for cross to close search bar
  });
});

describe('Add a section and check if the final exam was added correctly', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('acct1220');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button/i').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[5]/div[1]/div/div[1]');
    cy.contains('ACCT*1220*0101 - LEC');
    cy.xpath('//*[@id="root"]/div/div/div/div/div[1]/div[1]/form/div/div[1]/button').click(); //xpath for cross to close search bar
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div[2]/button').click(); //xpath for view exam
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div[1]'); //xpath for exam table
    cy.contains('ACCT*1220*0101 - EXAM');
  });
});

describe('Add a course section in the fall semester', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('cis3760');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]/div[1]/div/div[1]'); //xpath for section table
    cy.contains('CIS*3760*0101 - LEC');
  });
});

describe('Add a course section in the winter semester', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.xpath('/html/body/div/div/div/div/div/div[2]/button[2]/i').click(); //xpath for to change semester
    cy.get('input.form-control').type('acct1220');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[5]/div[1]/div/div[1]');
    cy.contains('ACCT*1220*0101 - LEC');
  });
});

describe('Check the states are mainted between different semesters', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.get('input.form-control').type('cis3760');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]/div[1]/div/div[1]'); //xpath for section table
    cy.contains('CIS*3760*0101 - LEC');
    cy.xpath('/html/body/div/div/div/div/div/div[2]/button[2]/i').click(); //xpath for to change semester
    cy.get('input.form-control').type('acct1220');
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button').click(); //xpath for section
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[5]/div[1]/div/div[1]');
    cy.contains('ACCT*1220*0101 - LEC');
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/button[1]').click();
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]/div[1]/div/div[1]'); //xpath for section table
    cy.contains('CIS*3760*0101 - LEC');
  });
});

describe('Add a course section from the dropdown menu', () => {
  it('passes', () => {
    cy.visit('http://app:3000/');
    cy.xpath('//*[@id="root"]/div/div/div/div/div[1]/div[1]/form/div/div[2]/button').click(); //xpath for view departments
    cy.xpath('//*[@id="root"]/div/div/div/div/div[1]/div[2]/a[10]').click();
    cy.xpath('//*[@id="dept_results-accordion"]/div[1]/h2/button').click();
    cy.xpath('//*[@id="collapse-1"]/div/div/li[1]/h5/button/i').click();
    cy.xpath('//*[@id="root"]/div/div/div/div/div[2]/div/div[1]/div/div[2]/div/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td[1]/div[1]/div[1]/div[1]');
    cy.contains('BIOL*1020*0101 - LEC');
  });
});


