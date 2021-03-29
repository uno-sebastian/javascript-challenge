// from data.js
var tableData = data;
// from states.js
var statesData = states;

// Get a references
var form = d3.select("form");
var button = d3.select("button");

// connect event listeners 
form.on("submit", onFormSubmit);
button.on("click", onFormSubmit);

function onFormSubmit() {
	// Prevent the page from refreshing
	d3.event.preventDefault();

	// Get the value property of the input element
	var formData = getFormData();

	// filter the sightings with the form data
	var sightings = filterSightings(formData, tableData);

	// update the table
	updateTable(sightings);
}

/**
 * 
 * @returns the form data as a dict collection with key value pairs; 
 * null if field was empty
 */
function getFormData() {
	return {
		datetime: parseDate(d3.select("#datetime").property("value")),
		city: parseCity(d3.select("#city").property("value")),
		state: parseState(d3.select("#state").property("value")),
		country: parseCountry(d3.select("#country").property("value")),
		shape: parseShape(d3.select("#shape").property("value"))
	}
}

/**
 * 
 * @param {date time string formated as DD/MM/YYY} datetime 
 * @returns a cleaned up datetime, or null if invalid
 */
function parseDate(datetime = "") {
	// if null, exit
	if (datetime === null)
		return null;
	// trim whitespace from string
	datetime = datetime.trim();
	// check if trimmed string is empty, if so exit
	if (datetime.length < 1)
		return null;
	// split the forward slashes to parse the input
	var splitDate = datetime.split("/");
	// if the format is wrong, exit
	if (splitDate.length < 3)
		return null;
	// Comes in as DD/MM/YYYY
	var year = parseInt(splitDate[2]);
	var month = parseInt(splitDate[1]);
	var day = parseInt(splitDate[0]);
	// return as format expected
	return `${day}/${month}/${year}`;
}

/**
 * 
 * @param {the city name as a string} city 
 * @returns a cleaned up city name, or null if invalid
 */
function parseCity(city = "") {
	// if null, exit
	if (city === null)
		return null;
	// trim whitespace from string
	city = city.trim();
	// check if trimmed string is empty, if so exit
	if (city.length < 1)
		return null;
	// return as format expected
	return city.toLowerCase();
}

/**
 * 
 * @param {the state name, in full or abbreviation} state 
 * @returns a cleaned up state abbreviation, or null if invalid
 */
function parseState(state = "") {
	// if null, exit
	if (state === null)
		return null;
	// trim whitespace from string and convert to lower case
	state = state.trim().toLowerCase();
	// check if trimmed string is empty, if so exit
	if (state.length < 1)
		return null;
	// if the state is the full name, check states name to find abbreviation
	if (state.length > 2) {
		var i;
		var length = statesData.length;
		for (i = 0; i < length; i++) {
			if (statesData[i].label.toLowerCase() === state) {
				console.log(state);
				return statesData[i].value.toLowerCase();
			}
		}
	}
	// return as format expected
	return state;
}

/**
 * 
 * @param {a country name as a string} country 
 * @returns a cleaned up country name, or null if invalid
 */
function parseCountry(country = "") {
	// if null, exit
	if (country === null)
		return null;
	// trim whitespace from string and convert to lower case
	country = country.trim().toLowerCase();
	// check if trimmed string is empty, if so exit
	if (country.length < 1)
		return null;
	// if usa, convert to us as database standard
	if (country === "usa")
		country = "us";
	// return as format expected
	return country;
}

/**
 * 
 * @param {a shape string value} note that the shape will be spaces if not selected 
 * @returns a cleaned up shape string, or null if invalid
 */
function parseShape(shape) {
	// trim whitespace from string
	shape = shape.trim();
	// check if trimmed string is empty, if so exit
	if (shape.length < 1)
		return null;

	return shape;
}

/**
 * 
 * @param {the fourm data as a dict of values or null} form 
 * @param {a list of all the sightings data} sightings 
 * @returns 
 */
function filterSightings(form, sightings) {
	// create a filter with all sightings pre-filter
	var filtered = sightings;
	// for each key, 
	//   if there is remaining sightings in the filtered array, 
	//   filter based on the key
	for (var key in form) {
		if (form[key] !== null && filtered.length > 0) {
			// apply a filter to filtered array
			filtered = filtered.filter(function (value, index, arr) {
				return value[key] === form[key];
			});
		}
	}

	return filtered;
}

/**
 * 
 * @param {the sightings to display, can be empty} sightings 
 */
function updateTable(sightings = []) {
	// grab the table body
	var tbody = d3.select("tbody");
	// clear the text
	tbody.text("");
	// if null, exit
	if (sightings === null)
		return;
	// if there are sightings, add them
	if (sightings.length > 0) {
		var tbody = d3.select("tbody");
		sightings.forEach(sighting => {
			var row = tbody.append("tr");
			Object.entries(sighting).forEach(function ([key, value]) {
				row.append("td").text(value);
			});
		});
	}
}

