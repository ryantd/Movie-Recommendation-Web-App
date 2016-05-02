# Movie Recommendation Web App

##layer
```
├─┬ index
│ ├── [public] header (login/signup/logout, user profile, search bar)
│ ├── [public] popular movies based on rating(rottentomatoes)
│ ├── [private] advanced recommendation movies
│ └── [public] footer
│
├─┬ movie profile
│ ├── [public] header (login/signup/logout, user profile, search bar)
│ ├── [public] movie details (title ...)
│ ├── [public] recommendation movies based on tags(may be randomly)
│ └── [public] footer
│
├─┬ log in
│ ├── [public] login form
│ ├── [public] link to signup
│ └── [public] footer
│
├─┬ sign up
│ ├── [public] signup form
│ ├── [public] link to login
│ └── [public] footer
│
└─┬ user profile
  ├─┬ login
  │ ├── [private] header (login/signup/logout, user profile, search bar)
  │ ├── [private] all info (name, age ...)
  │ ├── [private] like movies
  │ ├── [private] advanced recommendation movies
  │ └── [private] footer
  └─┬ not login
    └── [public] redirect to login page
```

##git

### (updated) create branch

type `git branch [xiaoyu]` to create your own branch

type `git checkout [xiaoyu]` to go to your own brance

### push to your own branch

type `git branch` to check which branch are you in now, make sure you are in your own branch to operate

(optional) type `git status` to check what files you changed

type `git add [filename]` or `git add . (add all changed files)` add changed files to your local repo

type `git commit -m "update README file"` to record what you did in this commit cycle

type `git push origin [xiaoyu]` to push your code to your own branch

### (new) merge to dev

type `git branch` to check which branch are you in now, make sure you are in your own branch to operate

type `git checkout dev` to go to dev branch

type `git pull` to get up-to-date commits

type `git merge [xiaoyu]` to merge your commits in xiaoyu branch

type `git push origin dev` to push dev to the github server

type `git checkout [xiaoyu]` to go to xiaoyu branch and continue your works

type `git rebase dev` to update your local repo

## (new) instructions about first use

firstly, when you type `node server.js`, please go to _http://localhost:3000/startup_ to init your database and download the poster images

##movie collection

_id

imdbId

title

year

genre

director

actors

description

imgname

likedby

json

##user collection

_id

username

encryptedPassword

currentSessionId

profile: {  name

            like
            
            uid
            
            birthYear
            
}
                                                 }

##file clarifying

data.js -- db part

main.js -- search and recommendation part

user.js -- user sys part

resources/poster -- save the poster image

resources/data -- input files (scraping from imdb)

##issues

