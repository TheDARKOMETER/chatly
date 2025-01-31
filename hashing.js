import bcrypt from "bcrypt";

await bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash('', salt, function (err, hash) {
        console.log(hash)
    })
})

bcrypt.compare('', '', function(err, result) {
    console.log(result)
})