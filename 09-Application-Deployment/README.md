# Application Deployment (Weather App)

### 1. Introduction

Let's deploy our App. We'll learn **Git**, **GitHub** and **Heroku**.

### 2. Join Heroku and GitHub

Create an account on GitHub and on Heroku. Then install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

```sh
# on Mac, via brew
brew tap heroku/brew && brew install heroku
# check if the install is ok
heroku --version
# login via the browser
heroku login
```

### 3. Version Control with Git

A version control allows us to **track changes** we make and can create what are essentially **save points** along the way for the **various versions** of our application. Without version control we're not going to have an easy way to **revert back to a previous working state** of your application.

Go to [git-scm](https://git-scm.com/) and also read [Pro Git](https://git-scm.com/book/en/v2) by Scott Chacon.

```sh
# check if git is installed
git --version
```

### 4. Exploring Git

|        1        |        2         |       3        |    4    |
| :-------------: | :--------------: | :------------: | :-----: |
| Untracked Files | Unstaged Changes | Staged Changes | Commits |

### 5. Integrating Git

```sh
# initialise Git
git init

git status
```

We need to create a `.gitignore` to NOT TRACKING the `node_modules` folder.

```sh
# inside the .gitignore
node_modules/
```

```sh
# add files to the stage area
git add src/
# or add every untracked files
git add .

git status
# let's commit
git commit -m "Initial commit"
```

### 6. Setting up SSH Keys

```sh
ls -a -l ~/.ssh
# (1) you have already one:
id_rsa
id_rsa.pub
# (2) you don't
ssh-keygen -t rsa -b 4096 -C "name@myemail.com"

eval "$(ssh-agent -s)"

ssh-add -K ~/.shh/id_rsa
```

### 7. Pushing Code to GitHub

Create a **new repository**.

```sh
git remote add origin git@github.com:******
git push -u origin master
```

But before to push it, **add your SSH key** into GitHub.

```sh
# copy (paste in GitHub)
cat ~/.shh/id_rsa.pub
# test your ssh connection
ssh -T git@github.com
```

### 8. Deploying Nodejs to Heroku

```sh
# add your ssh key to Heroku via the CLI
heroku keys:add
# create (name as to be unique)
heroku create mxh-weather-app
```

Before we push the code to Heroku, we need to change the package.json file. We have to add a `start` in `scripts`.

```json
{
  "...": "...",
  "scripts": {
    "start": "node src/app.js",
    "...": "..."
  },
  "...": "..."
}
```

Also, we need to change the `port` in `app.js`.

```js
// web-server/src/app.js
//...
const port = process.env.PORT || 3000;
//...
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
```

And last thing, in `web-server/public/js/app.js` we need to remove the localhost url...

```js
// from
fetch(`http://localhost:3000/weather?address=${location}`).then( //...
// to
fetch(`/weather?address=${location}`).then( //...
```

```sh
git init
git status
# you should see (origin and heroku, if not continue below)
git remote
# set up the remote (I made a mistake)
git remote add origin https://git.heroku.com/******
# replace origin with heroku
git remote rename origin heroku

git add .
git commit -m "Initial commit"
git push heroku master
```

### 9. Avoiding Global Modules

Add `dev` in `scripts` and don't forget to add `nodemon` as a **devDependencies**.

```json
{
  "...": "...",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js -e js,hbs"
  },
  "...": "..."
}
```
