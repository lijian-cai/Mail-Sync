const _ = require('lodash');

export default class TradeHistoryService {
  constructor(tradeHistoryModel,sequelize) {
    this._tradeHistoryModel = tradeHistoryModel;
    this._sequelize = sequelize;
  }

  parseAmount(amount_str) {
    return parseFloat(_.replace(amount_str, /\$|,/g, ''));
  }

  add(num1, num2) {
    return _.round(_.add(num1, num2), 2)
  }

  diff(num1, num2) {
    return _.round(_.subtract(num1, num2), 2)
  }

  cal_p_l(arr_data) {
    let p_l = 0
    let result = {}
    _.forEach(arr_data, item => item.amount = this.parseAmount(item.amount));
    _.forEach(arr_data, (value, key) => {
      if(!(value.code in result)) {
        result[value.code] = [value.action, value.amount, value.quantity]
      }else if((value.code in result) && result[value.code].includes(value.action)) {
        const currentAmount = result[value.code][1]
        const currentQuantity = result[value.code][2]
        if(value.action === 'bought') {
          result[value.code][1] = this.add(currentAmount, value.amount)
          result[value.code][2] = this.add(currentQuantity, value.quantity)
        } else if(value.action === 'sold') {
          result[value.code][1] = this.diff(currentAmount, value.amount)
          result[value.code][2] = this.diff(currentQuantity, value.quantity)
        }
      }else if((value.code in result) && !(result[value.code].includes(value.action))){
        let currentAmount = result[value.code][1]
        let currentQuantity = result[value.code][2]
        if(currentQuantity - value.quantity === 0) {
          p_l += this.diff(value.amount, currentAmount)
          p_l = _.round(p_l, 2);
          delete result[value.code]
        } else {
          result[value.code][1] = this.diff(currentAmount, value.amount)
          currentAmount = result[value.code][1]
          result[value.code][2] -= value.quantity
        }
      }
    })
    return p_l
  }

  getPLData() {

  }

  getTotal() {
    return this._tradeHistoryModel.findAll({
      attributes: ['action', 'code', 'amount', 'quantity'],
      raw: true
    }).then(res =>  {
      let total = 0
      total = this.cal_p_l(res)
      return total
    }).catch(err => {
      console.log(err)
      return false
    });
  }  
}