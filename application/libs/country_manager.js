
// ========================================
// Module for managing countries and cities
// ========================================


var CountryModel = require('../models/country');
var CityModel    = require('../models/city');


module.exports = {
    // *****************************************************************************************************************
    // Get list of countries.
    // On success: callback(null, countries[])
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    getCountries : function (callback) {
        CountryModel.findAll({
            where: { }
        }).then(function (countries) {
            var countriesList = [];
            countries.forEach(function(item, i, countries) {
                var countryJSON = {
                    name: item.Name,
                    code: item.Code
                };
                countriesList.push(countryJSON);
            });
            return callback(null, countriesList);
        }).catch(function (err) {
            return callback(err, null);
        });
    },


    // *****************************************************************************************************************
    // Get list of cities of the country.
    // On success: callback(null, cities[])
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    getCities : function (countryCode, callback) {
        CityModel.findAll({
           where: { CountryCode: countryCode }
        }).then(function (cities) {
            var cityList = [];
            cities.forEach(function(item, i, cities) {
                var cityJSON = {
                    name: item.Name,
                    code: item.ID
                };
                cityList.push(cityJSON);
            });
            return callback(null, cityList);
        }).catch(function (err) {
            return callback(err, null);
        });
    }


};