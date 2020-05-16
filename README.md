# Mail-Sync

One Paragraph of project description goes here

### Installing

Clone project and

Create a .env file on root and config your .env file like this:

```
// .env file
USER = yourname@gmail.com,
PASSWORD = 'yourpassword',
HOST = 'imap.gmail.com',
PORT = 993,
TLS = true
```

and run command:

```
npm i
npm install -g secure-env
secure-env .env -s secretEnv
npm link secure-env
```

Then you can delete your .env file.
