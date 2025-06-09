## RYOA

Roll your own authentication. 

This is a fully self rolled libraryless authentication module with a nice to use API and full type safety, strong and safe seperation between server and client secure and you being the owner of all your data.

This implementation runs on sqlite (libsql turso) but postgres works just as well.

## Architecture

We use a functional repository pattern to access the database. The repositories are located in the `repositories` folder. The repositories are called using server actions located in the `mutations` and `queries` folders. The server actions are called from the UI using `useFormAction` and `formAction`. 
```
Repositories <> Server Actions <> React hooks <> UI <> Views <> Pages```

We make use of sessions and JWT tokens. Passwords are hashed using bcrypt.

## Features

- Email and password sign up
- Modular OAuth 2 with currently setup Google, Github and Discord
- Admin role with admin dashboard with user management and system settings
- Full profile CRUD
- Connect OAuth accounts to existing email & password accounts
- Delete account


