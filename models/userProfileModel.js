module.exports = (sequelize, DataTypes) => {

    const UserProfile = sequelize.define("user_profile", {
        user_id: {
            type: DataTypes.INTEGER
        },
        address: {
            type: DataTypes.STRING
        },
        phone_number: {
            type: DataTypes.STRING
        },
        qualification: {
            type: DataTypes.STRING        },
        city: {
            type: DataTypes.INTEGER
        },
        state: {
            type: DataTypes.INTEGER
        },
        country: {
            type: DataTypes.INTEGER
        }
    })

    return UserProfile

}