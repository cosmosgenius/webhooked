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
/<app_name>
```
and
```
/<app_name>/deploy
```
Check out the [wiki page](https://github.com/cosmosgenius/webhooked/wiki) for more information.


[travis-image]: https://img.shields.io/travis/cosmosgenius/webhooked.svg?style=flat-square
[travis-url]: https://travis-ci.org/cosmosgenius/webhooked
[coveralls-image]: https://img.shields.io/coveralls/cosmosgenius/webhooked.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/cosmosgenius/webhooked?branch=master
[david-image]: http://img.shields.io/david/cosmosgenius/webhooked.svg?style=flat-square
[david-url]: https://david-dm.org/cosmosgenius/webhooked

## License

The MIT License (MIT)

Copyright (c) 2014 Sharat M R <cosmosgenius@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
