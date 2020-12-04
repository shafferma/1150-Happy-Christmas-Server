
Kill your build if it is stuck on heroku
```
heroku builds:cancel -a "happy-christmas-server"
```

View the server logs in real time on Heroku
```
heroku logs -t -a "happy-christmas-server"
```

1. `npm i`
1. reset database if required...
    1. open `index.js`
    1. uncomment the "db sync force true" line
    1. comment "db seq sync" line above 
    1. save & restart 
    1. swap 2 & 3 and save changes -db reset
1. `npm run dev`