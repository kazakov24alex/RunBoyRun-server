
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
            var nameArr = [];
            countries.forEach(function(item, i, countries) {
                var countryJSON = new Object()
                countryJSON.name = item.Name;
                nameArr.push(countryJSON);
            });
            return callback(null, nameArr);
        }).catch(function (err) {
            return callback(err, null);
        });
    },


    // *****************************************************************************************************************
    // Get list of cities of the country.
    // On success: callback(null, cities[])
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    getCities : function (country, callback) {
        CountryModel.findOne({
            where: { Name: country }
        }).then(function (countryObj) {

            CityModel.findAll({
               where: { CountryCode: countryObj.Code }
            }).then(function (cities) {
            var nameArr = [];
            cities.forEach(function(item, i, cities) {
                var cityJSON;
                cityJSON.name = item.Name;
                nameArr.push(cityJSON);
            });
            return callback(null, nameArr);
        });

        }).catch(function (err) {
            return callback(err, null);
        });
    }


};