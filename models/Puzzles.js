module.exports = (sequelize, DataTypes) => {
    return sequelize.define('puzzles', {
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hint: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        valid: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        invalid: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        timestamps: false,
        underscored: true,
    });
};
