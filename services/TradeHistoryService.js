const _ = require('lodash');

export default class TradeHistoryService {
  constructor(tradeHistoryModel,sequelize) {
    this._tradeHistoryModel = tradeHistoryModel;
    this._sequelize = sequelize;
  }

  parseAmount(amount_str) {
    return parseFloat(_.replace(amount_str, /\$|,/g, ''));
  }

  addAmount(num1, num2) {
    return _.add(num1, num2)
  }

  diffAmount(num1, num2) {
    return _.subtract(num1, num2)
  }

  getTotal() {
    return this._tradeHistoryModel.findAll({
      attributes: ['action', 'code', 'amount'],
      raw: true
    }).then(res =>  {
      let result = {}
      let total = 0
      _.forEach(res, item => item.amount = this.parseAmount(item.amount));
      _.forEach(res, (value, key) => {
        if(!(value.code in result)) {
          result[value.code] = [value.action, value.amount]
        }else if((value.code in result) && result[value.code].includes(value.action)) {
          const currentAmount = result[value.code][1]
          result[value.code][1] = this.addAmount(currentAmount, value.amount)
        }else if((value.code in result) && !(result[value.code].includes(value.action))){
          const currentAmount = result[value.code][1]
          total += this.diffAmount(value.amount, currentAmount)
          total = _.round(total, 2);
          delete result[value.code]
        }
      })
      return total
    }).catch(err => {
      console.log(err)
      return false
    });
  }  
}