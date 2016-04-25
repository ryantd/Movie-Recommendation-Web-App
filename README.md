# Movie Recommendation Web App

##git

### create branch

type `git checkout -b [xiaoyu]` to create your own branch

type `git branch [xiaoyu]` to go to your own brance

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

##mongodb export and import

mongodb export:
mongodump --archive=test.20150715.gz --gzip --db lab7

mongodb import:
mongorestore --gzip --archive=test.20150715.gz --db lab7

##file clarifying

data.js -- db part

main.js -- search and recommendation part

user.js -- user sys part

resources/poster -- save the poster image

resources/data -- input files (scraping from imdb)

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

##issues

