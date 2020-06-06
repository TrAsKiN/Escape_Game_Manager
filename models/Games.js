module.exports = (sequelize, DataTypes) => {
    return sequelize.define('games', {
        guild_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        channel_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        timestamps: false,
        underscored: true,
    });
};
