// Randomly roll one of the potential (numbered) chunks
function pickPotentialChunk() {
    // Get checkbox values
    var removePotential = document.getElementById("removePotential").checked;
    var selectNewNeighbors = document.getElementById("selectNewNeighbors").checked;
	var chunks = document.getElementsByClassName("potential");
	if (chunks.length == 0) return;

    removeUnlockedTileNumbers();
    removeBetweenTileNumbers();

	// Randomly pick one of the numbered tiles
    var randomIndex = Math.floor(Math.random() * chunks.length);
	for (var i = chunks.length - 1; i >= 0; i--) {
		if (i == randomIndex) {
            var chunk = chunks[i];
            // Set new neighbors as potential
            if (selectNewNeighbors && !removePotential) {
                addPotentialNeighborsForID(chunks[randomIndex].id);
            }
            chunk.className = "between";
            removeElementFromArray(potentialChunks, Number(chunk.id));
			// Wait 1 second for "between" animation to finish
			setTimeout(() => {
				//var savedText = chunk.innerText;
				addChunkAsUnlocked(chunk.id);
				//chunk.innerText = savedText;
            }, 1000);
		}
		else if (removePotential) {
            addChunkAsLocked(chunks[i].id);
        }
    }
    
    if (!removePotential) {
        updatePotentialNumbers();
    }
}

function pickChunk(id) {
    // Get checkbox values
    var removePotential = document.getElementById("removePotential").checked;
    var selectNewNeighbors = document.getElementById("selectNewNeighbors").checked;
	var chunks = document.getElementsByClassName("maybe");
	if (chunks.length == 0) return;

    removeUnlockedTileNumbers();
    removeBetweenTileNumbers();

	// Randomly pick one of the numbered tiles
    var randomIndex = id;
	for (var i = chunks.length - 1; i >= 0; i--) {
		if (chunks[i] !== undefined && chunks[i].id == randomIndex) {
            var chunk = chunks[i];
            // Set new neighbors as potential
            if (selectNewNeighbors && !removePotential) {
                addPotentialNeighborsForID(chunks[i].id);
            }
            chunk.className = "between";
            removeElementFromArray(maybeChunks, Number(chunk.id));
			// Wait 1 second for "between" animation to finish
			setTimeout(() => {
				//var savedText = chunk.innerText;
				addChunkAsUnlocked(chunk.id);
				//chunk.innerText = savedText;
            }, 1000);
        }
        else if (removePotential) {
            addChunkAsLocked(chunks[i].id);
        }
		else {
            addChunkAsPotential(chunks[i].id);
        }
    }
    
    if (!removePotential) {
        updatePotentialNumbers();
    }

    if (removePotential) {
        var chunks2 = document.getElementsByClassName("potential");

        for (var i = chunks2.length - 1; i >= 0; i--) {
            addChunkAsLocked(chunks2[i].id);
        }
    }

    document.getElementById("pick1").disabled = false;
    document.getElementById("pick1").className = "picker";
    document.getElementById("pick2").disabled = false;
    document.getElementById("pick2").className = "picker";
}

// Randomly roll two
function pickPotentialChunk2() {
    // Get checkbox values
    var removePotential = document.getElementById("removePotential").checked;
	var chunks = document.getElementsByClassName("potential");
	if (chunks.length == 0) return;

    removeUnlockedTileNumbers();
    removeBetweenTileNumbers();

	// Randomly pick one of the numbered tiles
	for (var ii = 0; ii < 2; ii++) {
        var randomIndex = Math.floor(Math.random() * chunks.length);
        for (var i = chunks.length - 1; i >= 0; i--) {
            if (i == randomIndex) {
                var chunk = chunks[i];
                chunk.className = "between";
                removeElementFromArray(potentialChunks, Number(chunk.id));
                //var savedText = chunk.innerText;
                addChunkAsMaybe(chunk.id);
                //chunk.innerText = savedText;
            }
        }
	}
    
    if (!removePotential) {
        updatePotentialNumbers();
    }

    document.getElementById("pick1").disabled = true;
    document.getElementById("pick1").className = "picker disabled";
    document.getElementById("pick2").disabled = true;
    document.getElementById("pick2").className = "picker disabled";
}

// Move the map to the center point between all unlocked tiles
function centerOnUnlockedTiles() {
    var centerPoint = [0, 0];
    for (var i = 0; i < unlockedChunks.length; i++) {
        // Sum all unlocked chunk center points, then divide by the number of unlocked chunks
        var chunkPoint = getChunkCenterPoint(unlockedChunks[i]);
        centerPoint[0] += chunkPoint[0];
        centerPoint[1] += chunkPoint[1];
    }
    centerPoint[0] /= unlockedChunks.length;
    centerPoint[1] /= unlockedChunks.length;

    repositionMapOnPoint(document.getElementById("imgDiv"), centerPoint[0], centerPoint[1]);

    fixMapEdges(document.getElementById("imgDiv"));
}

// Disable the other checkbox when one is active
function disableOtherCheckbox(box) {
    if (box.id == "selectNewNeighbors" && box.checked) {
        document.getElementById("removePotential").disabled = true;
    }
    else if (box.id == "selectNewNeighbors" && !box.checked) {
        document.getElementById("removePotential").disabled = false;
    }
    else if (box.id == "removePotential" && box.checked) {
        document.getElementById("selectNewNeighbors").disabled = true;
    }
    else if (box.id == "removePotential" && !box.checked) {
        document.getElementById("selectNewNeighbors").disabled = false;
    }
}

// Return the X- and Y-values of a given chunk's center point
function getChunkCenterPoint(id) {
    var chunk = document.getElementById(id);
    // Format: [x, y]
    var point = [
        chunk.offsetWidth * (id % cols) + chunk.offsetWidth / 2,
        chunk.offsetHeight * Math.floor(id / cols) + chunk.offsetHeight / 2
    ];
    return point;
}

// Set all neighbors to this chunk as potential
function addPotentialNeighborsForID(id) {
    id = Number(id);

    var newNeighbors = getAdjacentTileIDs(id);
    for (var i = 0; i < newNeighbors.length; i++) {
        if (newNeighbors[i] == -1) continue;
        else if (document.getElementById(newNeighbors[i]).className == "locked") {
            addChunkAsPotential(newNeighbors[i]);
        }
    }
}

// TODO: Add button for this
// Select all chunks neighboring "unlocked" chunks
function selectAllNeighbors() {
    for (var i = 0; i < unlockedChunks.length; i++) {
        addPotentialNeighborsForID(unlockedChunks[i]);
    }
}

// Toggle visibility of a given sidebar
function toggleSidebar(id, side) {
    var sideDiv = document.getElementById(side);
    // Slide the sidebar off the screen
    if (getComputedStyle(sideDiv).getPropertyValue("display") == "block") {
        // Pick between the left or right sidebar
        if (side == "sidebarLeft") {
            sideDiv.style.left = -(sideDiv.offsetWidth) + "px";
        }
        else if (side == "sidebarRight") {
            sideDiv.style.right = (-sideDiv.offsetWidth) + "px";
        }
        // Wait until the sidebar is off-screen to make it invisible
        // Then fix the map if it is now out of bounds
        setTimeout(() => {
            sideDiv.style.display = "none";
            fixMapEdges(document.getElementById("imgDiv"));
        }, 750);
    }
    // Slide the sidebar back on the screen
    else {
        sideDiv.style.display = "block";
        // Wait a small amount before starting the animation because
        // Firefox sometimes doesn't show the animation
        setTimeout(() => {
            if (side == "sidebarLeft") {
                sideDiv.style.left = "0%";
            }
            else if (side == "sidebarRight") {
                sideDiv.style.right = "0%";
            }
        }, 15);
    }

    var arrowBackground = document.getElementById(id + "Background");
    var arrow = document.getElementById(id);
    // Slide and rotate the arrow to the edge of the screen
    setTimeout(() => {
        
    }, 15);
    if (id == "arrowLeft") {
        // Custom left value hasn't been set yet, so initialize it
        if (arrowBackground.style.left == "") arrowBackground.style.left = "13.5%";

        if (arrowBackground.style.left == "13.5%") {
            arrowBackground.style.left = "-0.5%";
            arrow.style.transform = "rotate(180deg)";
        }
        else if (arrowBackground.style.left == "-0.5%") {
            setTimeout(() => {
                arrowBackground.style.left = "13.5%";
                arrow.style.transform = "rotate(0deg)";
            }, 15);
        }
    }
    else if (id == "arrowRight") {
        // Custom right value hasn't been set yet, so initialize it
        if (arrowBackground.style.right == "") arrowBackground.style.right = "13.5%";

        if (arrowBackground.style.right == "13.5%") {
            arrowBackground.style.right = "-0.5%";
            arrow.style.transform = "rotate(-180deg)";
        }
        else if (arrowBackground.style.right == "-0.5%") {
            setTimeout(() => {
                arrowBackground.style.right = "13.5%";
                arrow.style.transform = "rotate(0deg)";
            }, 15);
        }
    }
}
