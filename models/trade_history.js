'use strict';
module.exports = (sequelize, DataTypes) => {
  const trade_history = sequelize.define('trade_history', {
    msg_id: {
     type: DataTypes.INTEGER,
     unique: true
    },
    action: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    code: DataTypes.STRING,
    price: DataTypes.STRING,
    amount: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    indexes:[
      {
        fields: ['code', 'msg_id']
      },
    ]
  });
  trade_history.associate = function(models) {
    // associations can be defined here
  };
  return trade_history;
};