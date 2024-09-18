import asyncHandler from 'express-async-handler';
import City from '../models/cityModel.js';


// @desc    Register a new city
// route    POST /api/cities/
// @access  Public
const createCity = asyncHandler(async (req, res) => {
    // Check if the request body is an array or a single object
    const cities = Array.isArray(req.body) ? req.body : [req.body];

    try {
        const addedCities = [];

        // Loop through each city in the array
        for (const cityData of cities) {
            const { district_name, city_name } = cityData;

            // Check if the city already exists in the database
            const cityExists = await City.findOne({ district_name, city_name });
            if (cityExists) {
                return res.status(400).send({ status: "City already in database", city: city_name });
            }

            // If city doesn't exist, create a new one
            const newCity = new City({
                district_name,
                city_name
            });

            await newCity.save();
            addedCities.push(newCity);
        }

        res.status(201).send({ status: "Cities Added Successfully", Cities: addedCities });

    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error while adding cities", error: error.message });
    }
});




// @desc    Get cities
// route    GET /api/cities/:district
// @access  pulic
const getallcities = asyncHandler(async (req, res) => {
    const districtName = req.params.district;
    console.log(districtName);
    try {
        // Find all cities with the specified district name
        const cities = await City.find({ district_name: districtName });

        if (cities.length === 0) {
            return res.status(404).send({ status: "No cities found for this district" });
        }

        res.status(200).send({ status: "Cities fetched successfully", cities });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error fetching cities data" });
    }
});


 export { 
    createCity,
    getallcities
 };