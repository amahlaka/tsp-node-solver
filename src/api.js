var request = require('request');

function getCities(){
    return request('https://api-staging.vello.fi/nutcracker/task', {json:true}, function(err,res,body){
        if (err) { throw(err); 
        }
        return(body);
    });

}

function postResponse(path, totalDistance, email="arttu.mahlakaarto@gmail.com", seed){
    body = { "path":path,
        "distance":totalDistance,
        "email":email,
        "seed":seed
        }
        request.post('https://api-staging.vello.fi/nutcracker/return-task',{json:body}, function(err,res,body){
            if (err) {
                console.error(err);
                throw(err);
            }
            console.log(`statusCode: ${res.statusCode}`);
            return(body);
        });

}
module.exports = {
    getCities,
    postResponse
}