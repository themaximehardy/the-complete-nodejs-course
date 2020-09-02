# Installing and Exploring Node.js

### 1. Introduction

We'll get our machine set up for the class! Installing **Node.js** and **Visual Studio Code**.

### 2. Installing Node.js and Visual Studio Code

Go to [Node.js Official Website](https://nodejs.org/en/). It is recommended to use a **node version > 12**.

_Note: LTS = Long Term Support_

Open the terminal, and type `node -v` to get the version.

### 3. What is Node.js?

At the beginning, JS could only run in the browser but Nodejs allows us to run it as a **standalone process on our machine**. So, before Nodejs, javascript could not be used as a more general purpose programming language. It was limited to what the browser allowed it to do.

We could use javascript to add a click event to a button or to redirect a user to a specific page but it wasn't possible to use JS outside of the browser to build things like **web servers** that could access the file system and connect to databases.

Nodejs allows us to create web servers, command line interfaces, back end application and more.

Nodejs is a way to run JS code on the server as opposed to being forced to run it on the client. How exactly is this possible?

> Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.

_Note: V8 engine is a Google open source project that powers the Chrome browser... It's **written in C++** programming language._

The job of the engine (V8 or any of the other ones out there) is to **compile JS code down to machine code** that your machine can actually execute.

Nodejs doesn't need to manipulate the DOM but instead the Nodejs runtime provides various tools that Nodejs developers need – libraries for setting up web servers integrating with the file systems...

![browser-node](../img/s02/2-1-browser-node.png 'browser-node')

So JS doesn't know how to read a file from disk but C++ does. So, when someone uses JS code and Nodejs to read a file from disk, it just defers all of that to C++ function that can actually read the file from disk and get the results back to where they need to be.

If we open a terminal and we type `node`, we can run individual node statements also known as an **REPL = Read Eval Print Loop**.

Differences between browser and Nodejs – `window` object is available in the browser but it is not defined in Nodejs. BUt we have `global` object in Nodejs and not defined in the browser. In the browser, we have access to `document` but not in Nodejs. But we have `process` in Nodejs.

| Object     | Browser | Nodejs  |
| :--------- | :-----: | :-----: |
| `window`   | **YES** |    -    |
| `document` | **YES** |    -    |
| `global`   |    -    | **YES** |
| `process`  |    -    | **YES** |

Nodejs is JavaScript on the server. It is possible because it uses the V8 JS engine to run all of the JS codeyou provide. Nodejs is able to "teach" JS new things by providing C++ bindings to V8. This allows JS to do anything that C++ can do (and C++ can indeed access the file system).

### 4. Why Should I Use Node.js?

> Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

Let's focus on "**non-blocking I/O model**" – what exactly is I/O (it stands for Input / Output). A Nodejs application is going to use I/O anytime it's trying to communicate with the outside world (reading some data from a file, quering a database to fetch some records...). And I/O operations take time, but with Nodejs we get non-blocking I/O. All these operations are running in the background and don't block everything. It is a critical feature of what makes Nodejs so great!

![block-vs-non-block](../img/s02/2-2-block-vs-non-block.png 'block-vs-non-block')

Nodejs allows to process multiple requests at the exact same time for different users. So you could be fetching some data for a user 1 while processing a new request from user 2.

### 5. Your First Node.js Script

```js
// node-course/hello.js
console.log('Welcome to the class!');
```

Go and check the [Console documentation](https://nodejs.org/dist/latest-v12.x/docs/api/console.html). And more precisely, [`console.log([data][, ...args])`](https://nodejs.org/dist/latest-v12.x/docs/api/console.html#console_console_log_data_args).
