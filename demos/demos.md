## Sourcemap Demo Apps
This folder contains some javascript demo applications. These applications show you how can grab data from sourcemap and visualize it locally in different ways. They are intended to be more full featured examples that the included sample calls.

* Leaflet/Geojson - This example provides an interface for requesting a supplychain in geojson format, and then rendering it with leaflet. This is done without padding, so you need a modern browser to get cross-domain support. Because sourcemap only provides simple line endpoints in the geojson paths, this example implements different line drawing algorithms to experiment with.

* Flot/Emissions - This example provides an interface for listing recent supplychains on sourcemap in json. When a supplychain is selected, another call is made to get the full supplychain, and the total co2e emissions of each stop is graphed out in flot. Repeated selections will stack multiple supplychains.

* D3/Graph - This example provides an interface for listing recent supplychains on sourcemap in json. When a supplychain is selected, another call is made to get the full supplychain, and the to_stop, from_stop, local_stop_id properties are read to construct a force directed graph of these relationships.