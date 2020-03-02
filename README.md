# bignumber-math-expression
A JavaScript library for arbitrary-precision decimal and non-decimal arithmetic with math-expression

## Features
- Integers and decimals
- NO API but full-featured `+ - * / ** %`

## Usage
`npm install bignumber-math-expression --save`

ES6 module:

```
import BigNumber from 'bignumber-math-expression'

BigNumber('0.1 + 0.2')                // "0.3"
BigNumber('0.3 / (0.1 + 0.2)')        // "1"
BigNumber('2 ** 53 + 1')              // "9007199254740993"

const x = '0.1'
const y = '0.2'
BigNumber(`${x} + ${y}`)              // "0.3"
```

## License
[MIT](https://github.com/licaomeng/bignumber-math-expression/blob/master/LICENSE)
