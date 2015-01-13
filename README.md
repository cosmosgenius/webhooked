Webhooked
=========

A deployment tool using REST API interface.

[![Build status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![Test coverage][coveralls-image]][coveralls-url]

##Install
1. Run [MongoDB](http://docs.mongodb.org/manual/installation/) server

	```
	mongod
	```

2. Install dependencies with [npm](https://www.npmjs.org/)

	```
	npm install
	```

3. Run tests

	```
	npm test
	```

4. Run server and other tasks with [grunt](http://gruntjs.com/)

	```
	grunt
	```

Now the app can be accessed via

```
http://localhost:8000
```

##Usage
API endpoints available are
```
/webapps
```
and
```
/deploy
```
Check out the [wiki page](https://github.com/cosmosgenius/webhooked/wiki) for more information.


[travis-image]: https://img.shields.io/travis/cosmosgenius/webhooked.svg?style=flat-square
[travis-url]: https://travis-ci.org/cosmosgenius/webhooked
[coveralls-image]: https://img.shields.io/coveralls/cosmosgenius/webhooked.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/cosmosgenius/webhooked?branch=master
[david-image]: http://img.shields.io/david/cosmosgenius/webhooked.svg?style=flat-square
[david-url]: https://david-dm.org/cosmosgenius/webhooked

## License

(C) released under [MIT license](LICENSE)