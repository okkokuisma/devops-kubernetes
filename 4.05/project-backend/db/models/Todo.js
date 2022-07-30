module.exports = (sequelize, DataTypes) => {
  return sequelize.define('todos', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    timestamps: true,
    updatedAt: false,
  })
}