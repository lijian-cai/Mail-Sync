'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'trade_histories',
      'msg_id',
      {
        type: Sequelize.INTEGER,
        unique: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('trade_histories', 'msg_id')
  }
};
