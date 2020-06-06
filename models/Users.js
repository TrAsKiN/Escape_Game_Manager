module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        discord_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    }, {
        timestamps: false,
        underscored: true,
    });
};
