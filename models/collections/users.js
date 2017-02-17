const mongoose   = require('mongoose'),
      auth       = require('../../auth')
      UsersModel = mongoose.model('User', { email: String, password: String });

UsersModel.saveStuff = function(email, password, update) {
    return new Promise(function(resolve, reject) {
        if (!email || !password) reject("Missing data!");
        
        let hashedPasword = auth.hashPassword(password);

        var person = UsersModel.findOne({email}, (err, res) => {
            if (err) console.warn(err);
            
            if (!res) {
                new UsersModel({email: email, password: hashedPasword})
                .save(function(err, doc) {
                    if (err) {
                        return reject("There was a problem registering the user.");
                    } else {
                        console.log("success")
                        return resolve(true);
                    }
                });
            } else {
                if (update) {
                    UsersModel.update({ _id: res._id }, { $set: { password: hashedPasword }}, (x) => {
                        resolve();
                    });
                } else 
                    reject("This user already exists");
            }
        });
    })
}

module.exports = UsersModel;