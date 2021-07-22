const mongoose = require('mongoose');

class HexType extends mongoose.SchemaType {
	constructor(key, options) {
    super(key, options, 'HexType');
  }

  cast(val) {
    let _val = String(val);
    if (!_val.match(/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i)) {
      throw new Error('HexType: ' + val +
        ' is not a valid Hexadecimal color value');
    }
    return _val;
  }
}

module.exports = HexType;