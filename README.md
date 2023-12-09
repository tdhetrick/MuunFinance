# MuunFinance

## Introduction
MuunFinance is a persoal finance budget and tracking application built for my undergraduate course ITIS-5166 Network Based Application Development at UNCC.
I hope to continue this project after graduation into a full mint.com replacement.

## Features
- Accounts
- Categorys
- Budgets
- Transactions
- Dashboard
- Homepage

## Technology Stack
- **Frontend**: Vue.js
- **Backend**: Flask
- **Database**: MySQL

## Usage
How to:
- **Registration**: When you fiest go to the website you will be presented with a login screen with a link to register an account. Enter the self explanitory information and your registration PIN that is currently UNCC
- **Log in**: Use the email address and password you created on the previous page.
- **Add Accounts**: You must add at least one account to use the applicaion.
- **Create Categories**: Categorys are necessary for the dashboard to function add ones for your expenses and income.
- **Set up Budgets**: Add budgets based on the categories.
- **Record Transactions**: Add transactions for all of your categories. Make sure you add both credit and debits to get full use of the dashboard.

## Testing source in /tests screenshots in /docs
- API testing was done via pytest using the api_test.py
- E2E testing was performed using pytest and selenium.webdriver in the login_test.py
- Visual regression testing pytest, selenium and ApliTools eyes api in the login_test.py

![Example Image](/docs/dashCapture.PNG)




