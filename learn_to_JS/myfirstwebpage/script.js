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

    displayVehicleInfo(vehicleData) {
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
            
            // Fetch and display data
            const data = await this.fetchVehicleData(vin);
            this.displayVehicleInfo(data);
            
        } catch (error) {
            this.displayError(error);
        }
    }
}

// Initialize the vehicle search functionality
const vehicleSearch = new VehicleSearch();