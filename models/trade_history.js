'use strict';
module.exports = (sequelize, DataTypes) => {
  const trade_history = sequelize.define('trade_history', {
    action: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    code: DataTypes.STRING,
    price: DataTypes.STRING,
    amount: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    indexes:[
	    //普通索引,默认BTREE
      {
        fields: ['code']
      },
    ]
  });
  trade_history.associate = function(models) {
    // associations can be defined here
  };
  return trade_history;
};