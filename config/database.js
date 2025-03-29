module.exports = (Sequelize)=>{
    try {
        const sequelize = new Sequelize('registrationInfo','root','',{
            logging : false,
            dialect: "mysql",
            host:"localhost",
            port: " ",
            pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			}, define: {
                timestamps: false
              },
        })
        
        sequelize.authenticate()
        .then( () => {
            console.log("Database Connection established.....");
        })  
        .catch( (err) => {
            console.log("ERROR ---> ", err);
        })

        return sequelize
    } catch (e) {
        console.log("database connection err ", e);
    }
}