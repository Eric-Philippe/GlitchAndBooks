# Changelog

All notable changes to this project will be documented in this file.

## [Beta 1.2.1] - 2023-10-14

### Major additions

- The `Forgot Password` feature is now fully implemented !!
  - The server now uses the `Token Manager` made in the previous Beta to generate a token and send it to the user's email
  - The user can now reset his password by clicking on the link in the email

### Minor changes

- The routes/v1 get refactored to restructured a `v1/account/` route that host the `password` routes

  - The `password` routes are now in a separate file and includes all the rest password routes

- Fully updated the `.env/example` file to reflect the changes (SERVER_ADRESS and all the new MAILER variables)
- Some minor improvements on the `Create Account` page
- Minor code rearrangements in the `Mailer` code to make it more logic with the private and public methods

## [Beta 1.2.0] - 2023-10-13

### Major additions

- Refactor the `Users` table to add a email and avatar column
- Hash the password before storing it in the database
- Created a Mailer service to send emails for future features around the account
- Created the Token manager for the future forgot password feature (not implemented yet)
- Created a route for the account creation
- The Login page now has a link to the account creation page

### Minor changes

- All the previous passwords still work, they're all hashed now in the database
- Created the email for the project : `glitchandbooks.noreply@gmail.com`
- Updated the database documentation to reflect the changes (`database/`)

## [1.1.0] - 2023-09-01

### Major additions

- Add a `Statistics` page, with graphs and funny comparisons
- Add a `Random Book` button on the `Browse` page
- Add a `Download Data` button on the `Browse` page to save your library as a JSON, XML, CSV, XLSX, or PDF file

### Minor changes

- Few bug fixes, see issues [#1](https://github.com/Eric-Philippe/GlitchAndBooks/issues/1), [#2](https://github.com/Eric-Philippe/GlitchAndBooks/issues/2), [#3](https://github.com/Eric-Philippe/GlitchAndBooks/issues/3), [#4](https://github.com/Eric-Philippe/GlitchAndBooks/issues/4),

## [1.0.0] - 2023-08-25

I'm super excited to announce the first release of Glitch & Books !

- Introduce your new online library !
- Main features are implemented :
- `Home Page`, `Login Page` : _of course_.
- `Add` books to your library
- `Browse` your library with a fully dynamic interface `filter`, `sort`, `search` your books in a full responsive interface
- `Edit` your books
- `Delete` your books
