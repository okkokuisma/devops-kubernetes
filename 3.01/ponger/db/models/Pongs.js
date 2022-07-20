module.exports = (sequelize, DataTypes) => {
  return sequelize.define('pongs', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    updatedAt: false,
  })
}