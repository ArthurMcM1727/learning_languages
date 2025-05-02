trait Vehicle {
    fn make(&self) -> &str;
    fn model(&self) -> &str;
    fn year(&self) -> u32;
    fn speed(&self) -> u32;
    fn drive(&self);
}

struct Car {
    brand: String, 
    max_speed: u32,
}

impl Vehicle for Car {
    fn make(&self) -> &str {
        &self.brand
    }

    fn model(&self) -> &str {
        "Car"
    }

    fn year(&self) -> u32 {
        2023
    }

    fn speed(&self) -> u32 {
        self.max_speed
    }

    fn drive(&self) {
        println!("Vrooom! The car is moving!");
    }
}

struct Bicycle {
    model: String,
    max_speed: u32,
}

impl Vehicle for Bicycle {
    fn make(&self) -> &str {
        "Bicycle"
    }

    fn model(&self) -> &str {
        &self.model
    }

    fn year(&self) -> u32 {
        2023
    }

    fn speed(&self) -> u32 {
        self.max_speed
    }

    fn drive(&self) {
        println!("Pedaling the bicycle!");
    }
}

fn test_drive(vehicle: &dyn Vehicle) {
    vehicle.drive();
    println!("Driving a {} {} from {} at {} km/h", vehicle.make(), vehicle.model(), vehicle.year(), vehicle.speed());
}

fn main() {
    let car = Car {
        brand: String::from("Toyota"),
        max_speed: 180,
    };
    let bicycle = Bicycle {
        model: String::from("Mountain Bike"),
        max_speed: 30,
    };

    test_drive(&car);
    test_drive(&bicycle);
    println!("The {} is going at {} km/h", car.make(), car.speed());
    println!("The {} is going at {} km/h", bicycle.make(), bicycle.speed());
    println!("The {} is a {} from {}.", car.make(), car.model(), car.year());
    println!("The {} is a {} from {}.", bicycle.make(), bicycle.model(), bicycle.year());
}

