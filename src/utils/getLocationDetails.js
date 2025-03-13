const { default: axios } = require("axios");


const getLocationDetails = async (lat,lng) => {
   try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const res = await axios.get("https://api.opencagedata.com/geocode/v1/json",{
        params:{
            q:`${lat},${lng}`,
            key:apiKey,
            language:'en',
        },
    });

    const data = res.data;
    if(data.results.length===0) return {error : 'No location found'};
    
    const details = data.results[0].components;
    const obj = {
        country: details.country || null,
        state: details.state || null,
        city: details.city || details.town || details.village || null,
        postcode: details.postcode || null,
      };
    return obj;

   } catch (error) {
    console.error("Error opening opencage",err);
    return {error:error.message};
   }
}

module.exports = getLocationDetails;