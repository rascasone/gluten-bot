const Model = require('./model')
let model = new Model
model.get(50.082645,14.422385)
.then(d => console.log(d))
