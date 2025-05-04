document.getElementById("searchButton").addEventListener("click", function () {
    const VIN = document.getElementById("vinInput").value.trim();

    // Clear previous results
    document.getElementById("vehicleInfo").innerHTML = "";


    // Check if VIN is provided
    const hasVIN = VIN.length > 0;

    if (!hasVIN) {
        alert("Please fill in VIN number.");
        return;
    }

    if (hasVIN && VIN.length !== 17) {
        alert("Please enter a valid 17-character VIN.");
        return;
    }

    // Only make the VIN API call if VIN is provided
    if (hasVIN) {
        const urlVIN = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${VIN}?format=json`;
        
        fetch(urlVIN)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('VIN API Response:', data); // Debug log
                
                if (data.Results && data.Results[0]) {
                    const vehicleData = data.Results[0];
                    document.getElementById("vehicleInfo").innerHTML = `
                        <div class="result-card">
                            <h3>VIN Search Results</h3>
                            <p><strong>VIN:</strong> ${vehicleData.VIN}</p>
                            <p><strong>Make:</strong> ${vehicleData.Make}</p>
                            <p><strong>Model:</strong> ${vehicleData.Model}</p>
                            <p><strong>Year:</strong> ${vehicleData.ModelYear}</p>
                            <p><strong>Body Style:</strong> ${vehicleData.BodyClass || 'N/A'}</p>
                            <p><strong>Engine:</strong> ${vehicleData.EngineModel || 'N/A'}</p>
                        </div>
                    `;
                } else {
                    document.getElementById("vehicleInfo").innerHTML = 
                        `<p>No data found for VIN ${VIN}</p>`;
                }
            })
            .catch(err => {
                console.error('Error:', err);
                document.getElementById("vehicleInfo").innerHTML = 
                    `<p>Error retrieving VIN data. Please try again.</p>`;
            });
    }
});