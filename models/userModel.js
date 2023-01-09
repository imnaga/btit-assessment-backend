const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        status_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
                customValidator(value) {
                    if (value.length < 4) {
                      throw new Error("Firstname should be atleast 4 letters");
                    }
                }
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
                customValidator(value) {
                    if (value.length < 4) {
                      throw new Error("Lastname should be atleast 4 letters");
                    }
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Please enter your email address.' },
                isEmail: { msg: 'Please enter valid emial address.' }
            }
        },
        password: {
            type: DataTypes.TEXT,
            validate:{
                notEmpty:{ msg: 'Please enter your password.' },
                customValidator(value) {
                    if (value.length < 6) {
                      throw new Error("Your password length should be atleast 5 characters!");
                    }
                }
            }
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true,
                min:18
            }
        },
        token: {
            type: DataTypes.TEXT,
        },
        reset_link: {
            type: DataTypes.STRING
        },
        deletedAt: {
            type: DataTypes.DATE,
        }
    },{
        hooks:{
            beforeCreate: async (user) => {
                if (user.password) {
                 const salt = await bcrypt.genSaltSync(10, 'a');
                 user.password = bcrypt.hashSync(user.password, salt);
                }
            },
            beforeUpdate:async (user) => {
                if (user.password) {
                 const salt = await bcrypt.genSaltSync(10, 'a');
                 user.password = bcrypt.hashSync(user.password, salt);
                }
            }
        },
        instanceMethods: {
            validPassword: (password) => {
                return bcrypt.compareSync(password, this.password);
            }
        }
    })

    return User

}