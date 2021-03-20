# Leaflet.Maidenhead

### NOTE ON THIS FORK

Simply adding a few tweaks to the fantastic original version:
- Screenshot from a button
- Crosshair inside each gridsquare
- Topo map option

### What is this?
Draw a [Maidenhead Locator System](https://en.wikipedia.org/wiki/Maidenhead_Locator_System) lines and labels.
>*"The Maidenhead Locator System (a.k.a. QTH Locator and IARU Locator) is a geographic co-ordinate system used by amateur radio operators to succinctly describe their locations"*
### Demo anyone?
[Have a look](https://ha8tks.github.io/Leaflet.Maidenhead/examples/)
### Usage example
Include the maidenhead javasript file:
```bash
<script src="https://ha8tks.github.io/Leaflet.Maidenhead/src/L.Maidenhead.js"></script>
```
After instantiating the map:
```bash
L.maidenhead({
	color : 'rgba(255, 0, 0, 0.4)'
}).addTo(map);
```
### Options
- **color**: The color of the lines and labels. Default `rgba(255, 0, 0, 0.4)` 
