module.exports = (sequelize, DataTypes) => {
    return sequelize.define('games', {
        guild_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        channel_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: false,
        underscored: true,
    });
};
