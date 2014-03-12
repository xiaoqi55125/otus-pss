#overview
It's a pss manage system that built with node.js.

## install

```
$ cd projectPath/

$ npm install
```

## grunt

```
$ npm install -g grunt

$ cd projectPath/

$ grunt

```

## test 

```
$ npm install -g mocha

$ cd projectPath/

$ mocha test
```

## debug

```
$ cd projectPath/

$ DEBUG=$DEBUG node app.js          #DEBUG is a environment variable
```

## run

* manual:

```
$ cd projectPath/

$ NODE_ENV=$NODE_ENV node app.js    #NODE_ENV is a environment variable
```

* automatic (use pm2):

```
$ cp projectPath/docs/dispatch.sh ~/dispatch.sh

$ cd ~

$ sudo sh dispatch.sh 
```


