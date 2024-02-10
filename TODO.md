# TODO List for the account feature

## Add element to the table `users`

- [x] Add a column `email` to the table `users`
- [x] Add a column `avatar` to the table `users`
- [x] Update all the scheme on the code and documentation

## Password hashing

- [x] Hash the password before storing it in the database
- [x] Use a salt to hash the password

## Set an email address for all the services

- [x] Set an email address
- [x] Connect the email address to a global mail service

## Create an 'Account' Page

- [x] Replace the header `Logout` button by a `Account` button that display a dropdown modal with the logout button and the user's information
- [ ] Create an Account page that display the user's information
  - [x] [Logout button](#logout-button)
  - [x] [See the Change Password feature](#change-password)
  - [ ] [See the Delete Account feature](#delete-account)

## Create a form to create an account

- [x] Create the server services to manage accounts [create, update, delete]
- [x] Create a form to create an account on the login page

## Change password

- [x] Add a password change feature
- [x] Create a complete form to change the password

## Forgot password

- [x] Add a forgot password feature
- [x] Send an email to the user with a link to reset the password
- [x] Add a token to the link to reset the password

## Delete account

- [ ] Add a delete account feature

## Code page and legal

- [ ] Make a footer and put legal page
- [ ] Make a code page and put the link to the github repository

## Update the ChangeLog

- [ ] Update the ChangeLog with all the changes

# TODO List for the wishlist feature

## Consult the wishlist

- [ ] Create a page to consult the wishlist
- [ ] Add a button to the header to access the wishlist page

## Add a book to the wishlist

- [ ] Add a button to the book page to add the book to the wishlist
- [ ] Force the user to entrer n authors in a specific format (firstname_1 | lastname_1, firstname_2 | lastname_2, ...)

## Remove a book from the wishlist

- [ ] Add a button to the wishlist page to remove the book from the wishlist
- [ ] Add a button to the wishlist page to transfer the book to the library
- - [ ] Setup a url to put parameters to the add book url in order to pre-fill the form
