//Roughly the center of Missouri (lat/long)
var center = [38.6321346, -92.4013551]

//Target the chart div as the container for our leaflet map
//Set the center point and zoom level.
var map = L.map('chart').setView(center, 7);

// add an OpenStreetMap tile layer
//OpenStreetMap is an open source map layers anyone can use free of charge.
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// //Add an svg element to the map.
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");


// var LeafIcon = L.Icon.extend({
//     options: {
//         shadowUrl: 'leaf-shadow.png',
//         iconSize:     [38, 95],
//         shadowSize:   [50, 64],
//         iconAnchor:   [22, 94],
//         shadowAnchor: [4, 62],
//         popupAnchor:  [-3, -76]
//     }
// });


// var darkestIcon = new circleIcon({iconUrl: 'markers/darkest.png'}),
//     2darkestIcon = new circleIcon({iconUrl: 'markers/2darkest.png'}),
//     2lightestIcon = new circleIcon({iconUrl: 'markers/2lightest.png'}),
//     lightestIcon = new circleIcon({iconUrl: 'markers/lightest.png'};


//This will be a dictionary object we use to lookup the info for each county.
//It's empty for now. We add our data when we load or json.
var theData = {};


// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}









    

    d3.csv("data/new_data.csv", function(data) {


        drawMarkers(data)


        // Each row in the data is a county.
        // So we append an object to theData with the county name
        // And put the whole row in that object
        // So each county's data is accessible with the construction, theData[county name here];
        

        // $.each is the same as a for loop:
        // for (i=0; i < data.length; i++) {
            //where item is the same as data[i];
            //and i would be index, just like in a for loop.
        // }


        // $.each(data, function(i, item) {

        //     var lat = item["LATITUDE"];
        //     var lon = item["LONGITUDE"];

        //     L.marker([lat,lon]).addTo(map);

        // }) 

        //drawMap();

    })


// map.on('click', function(e) {
//     var facilityName = theData[lat, lon]["FACILITY_NAME"];
//     var totalReleases = theData[lat, lon]["TOTAL_RELEASES"]+"pounds";
// });

function drawMarkers(data) {


    for (i=0; i < data.length; i++) {

        //Define our variables here.
        var lat = data[i]["LATITUDE"];
        var lon = data[i]["LONGITUDE"];
        var placeName = data[i]["FACILITY_NAME"];
        var amount = data[i]["TOTAL_RELEASES"];
        var parent = data[i]["PARENT_COMPANY_NAME"];
        var address = data[i]["STREET_ADDRESS"];

        //Lets store our markup as a variable to keep things nice and tidy.
        var markup = 
            
            "<span class='amount'>"+amount+"</span>"+
            "<span class='amount'> Pounds of Lead</span><br>"+
            "<span class='placeName'>"+placeName+"</span><br>"+
            "<span class='address'>"+address+"</span><br>"+
            "<span class='parent'>Owned by </span>"+
            "<span class='parent'>"+parent+"</span>";

        //Draw the marker here. Pass the lat/long value unique to each location
        //and parse the markup to the `bindPopup` method so it shows up when a marker is selected
          L.marker([lat, lon]).addTo(map)
         .bindPopup(markup)
         .openPopup();


        // Alternate marker call uses `myIcon` to draw a different marker.
        // L.marker([lat, lon], {icon: myIcon}).addTo(map)
        //  .bindPopup(markup)
        //  .openPopup();


        // Color the markers by (4 colors maybe) by amount released.

    }


    
}



function drawMap() {

    //Load the Missouri County GeoJson
    d3.json("js/missouri.json", function(collection) {

        //This positions each county on it's the map.
        // var transform = d3.geo.transform({
        //         point: projectPoint
        //     }),
        //     path = d3.geo.path().projection(transform);

        
        //This draws the feature on the map and fills it with data
        //The data for each county is what's in the GeoJson.
        //The GeoJson contains county names...
        //...so whenever we want to look up our cancer data for a county...
        //We look it up by name using theData[county name here]
        var feature = g.selectAll("path")
            .data(collection.features)
            .enter()
            .append("path")
            .attr("class", "county");

        console.log(feature);

        // feature.style("fill", function(d) {

        //     var fips = d.properties.geoid;
        //     var releases = theData["TOTAL_RELEASES"];

        //     releases = Number(releases);

            // This is where we set our colors. There are many ways to do this.
            // This is probably the simplest.
            // if (povertyLevel <= 10) {
            //     return "#ffffb2";
            // } else if (povertyLevel > 10 && povertyLevel <= 20) {
            //     return "#fecc5c";
            // } else if (povertyLevel > 20 && povertyLevel <= 30) {
            //     return "#fd8d3c";
            // } else if (povertyLevel > 30) {
            //     return "#e31a1c";
            // }

            
        // })




        //The next block of code repositions the geojson objects on the map
        //whenever you zoom or pan on the map.
        //You should be able to leave this as is.
        map.on("viewreset", function() {
            reset();
        });


        reset();



        // Reposition the SVG to cover the features.
        function reset() {

            var bounds = path.bounds(collection),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            svg.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);

        }

        
    });

}


