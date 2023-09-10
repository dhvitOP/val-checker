const axios = require("axios");
module.exports = async function(websiteUrl){
    axios.post(websiteUrl,{
        data: {
          msg: 'Api Started'
        },
      }).then((res) => {
        console.log("Successfully requested the website path about api starting at " + websiteUrl + " With post method");
      }).catch((err) => {
        console.log(err)
        console.log('Could not request the website path about api starting at ' + websiteUrl + " With post method");
      });
}