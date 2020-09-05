# Debugging Node.js (Notes App)

### 1. Introduction

We'll learn how to **debug** and **inspect** our app when it's running.

### 2. Debugging Nodejs

We'll talk about some **debugging strategies** and **tools**. The Nodejs debugger which integrates directly with the Chrome developer tools (make it easier to debug your back end applications).

1. `console.log` specific values, this is the most basic tool available to us for debugging our apps.
2. **Nodejs debugger**

```js
//...
debugger;
//...
```

We just need to add `inspect` after node to be able to start the **debugger**.

```sh
# previously add a `debugger` line in your code (here inside our addNote function)
node inspect app.js add --title="Z" --body="Example of body"
```

Then, go to `chrome://inspect` in Chrome browser. And click **inspect**.

After clicking on the main arrow in the debugger. I can restart the debugger via the terminal by typing `restart`.
