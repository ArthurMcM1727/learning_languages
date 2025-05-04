class VehicleSearch {
    constructor() {
        this.API_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';
        this.searchButton = document.getElementById("searchButton");
        this.vinInput = document.getElementById("vinInput");
        this.vehicleInfoDiv = document.getElementById("vehicleInfo");
        
        // Bind event listeners
        this.searchButton.addEventListener("click", () => this.handleSearch());
    }

    validateVIN(vin) {
        if (!vin) {
            throw new Error("Please enter a VIN number.");
        }
        if (vin.length !== 17) {
            throw new Error("Please enter a valid 17-character VIN.");
        }
        return true;
    }

    async fetchVehicleData(vin) {
        const url = `${this.API_BASE_URL}/decodevinvalues/${vin}?format=json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('VIN API Response:', data); // Debug log
        
        return data;
    }

    async fetchFuelEconomyData(year, make, model) {
        try {
            const optionsUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`;
            const optionsRes = await fetch(optionsUrl);
            const optionsText = await optionsRes.text();
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(optionsText, "application/xml");
            const firstVehicleId = xmlDoc.querySelector("menuItem > value")?.textContent;
    
            if (!firstVehicleId) {
                return null;
            }
    
            const vehicleDetailUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/${firstVehicleId}`;
            const detailRes = await fetch(vehicleDetailUrl);
            const detailText = await detailRes.text();
            const detailDoc = parser.parseFromString(detailText, "application/xml");
    
            return {
                cityMPG: detailDoc.querySelector("city08")?.textContent || "N/A",
                highwayMPG: detailDoc.querySelector("highway08")?.textContent || "N/A",
                combinedMPG: detailDoc.querySelector("comb08")?.textContent || "N/A",
                engineSize: detailDoc.querySelector("displ")?.textContent || "N/A",
                cylinders: detailDoc.querySelector("cylinders")?.textContent || "N/A",
                fuelType: detailDoc.querySelector("fuelType")?.textContent || "N/A"
            };
    
        } catch (error) {
            console.error("FuelEconomy API Error:", error);
            return null;
        }
    }

    displayVehicleInfo(vehicleData, fuelData) {
        if (!vehicleData || !vehicleData.Results || !vehicleData.Results[0]) {
            this.vehicleInfoDiv.innerHTML = `<p>No data found for VIN ${this.vinInput.value}</p>`;
            return;
        }

        const vehicle = vehicleData.Results[0];
        this.vehicleInfoDiv.innerHTML = `
            <div class="result-card">
                <h3>VIN Search Results</h3>
                <p><strong>VIN:</strong> ${vehicle.VIN}</p>
                <p><strong>Make:</strong> ${vehicle.Make}</p>
                <p><strong>Model:</strong> ${vehicle.Model}</p>
                <p><strong>Year:</strong> ${vehicle.ModelYear}</p>
                <p><strong>Body Style:</strong> ${vehicle.BodyClass || 'N/A'}</p>
                <p><strong>Engine:</strong> ${vehicle.EngineModel || 'N/A'}</p>
                ${fuelData ? `
                    <h4>Fuel Economy Information</h4>
                    <p><strong>City MPG:</strong> ${fuelData.cityMPG}</p>
                    <p><strong>Highway MPG:</strong> ${fuelData.highwayMPG}</p>
                    <p><strong>Combined MPG:</strong> ${fuelData.combinedMPG}</p>
                    <p><strong>Engine Size:</strong> ${fuelData.engineSize}L</p>
                    <p><strong>Cylinders:</strong> ${fuelData.cylinders}</p>
                    <p><strong>Fuel Type:</strong> ${fuelData.fuelType}</p>
                ` : ''}
            </div>
        `;
    }

    displayError(error) {
        this.vehicleInfoDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error('Error:', error);
    }

    clearResults() {
        this.vehicleInfoDiv.innerHTML = "";
    }

    showLoading() {
        this.vehicleInfoDiv.innerHTML = "<p>Loading vehicle information...</p>";
    }

    async handleSearch() {
        try {
            const vin = this.vinInput.value.trim();
            this.clearResults();
            
            // Validate input
            this.validateVIN(vin);
            
            // Show loading state
            this.showLoading();
            
            // Fetch vehicle data first
            const vehicleData = await this.fetchVehicleData(vin);
            
            // Then fetch fuel economy data if vehicle data was found
            let fuelData = null;
            if (vehicleData?.Results?.[0]) {
                const vehicle = vehicleData.Results[0];
                fuelData = await this.fetchFuelEconomyData(
                    vehicle.ModelYear,
                    vehicle.Make,
                    vehicle.Model
                );
            }
            
            // Display all the data
            this.displayVehicleInfo(vehicleData, fuelData);
            
        } catch (error) {
            this.displayError(error);
        }
    }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    const vehicleSearch = new VehicleSearch();
});