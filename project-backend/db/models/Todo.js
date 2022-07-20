module.exports = (sequelize, DataTypes) => {
  return sequelize.define('todos', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    updatedAt: false,
  })
}