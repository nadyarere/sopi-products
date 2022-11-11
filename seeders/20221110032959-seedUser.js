'use strict';
const fs = require('fs')
const bcryptjs =require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const users = JSON.parse(fs.readFileSync('./datas/users.json', 'utf-8')).map(el => {
      delete el.id
      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(el.password, salt)
      el.password = hash;
      el.createdAt = new Date()
      el.updatedAt = new Date()
      return el
    })

    return queryInterface.bulkInsert("Users", users, {})
  },

  down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete("Users", null, {})

  }
};
