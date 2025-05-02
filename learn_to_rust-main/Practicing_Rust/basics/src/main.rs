// Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.

fn variable_examples() {
    // Fixed spacing around =
    let mut age = 23;
    let name = "Zachary";  // Removed unnecessary mut since we're shadowing
    age += 1;
    println!("Hello, {}! You are {} years old.", name, age);
}

fn control_flow() {
    let number: i32 = 5;

    if number > 0 {
        println!("The number is positive.");
    } else if number < 0 {
        println!("The number is negative.");
    } else {
        println!("The number is zero.");
    }

    for i in 1..=3 {
        println!("i = {}", i);
    }
}

fn functions(x: i32) -> i32 {
    let y = 5;
    x + y
}

fn square(number: i32) -> i32 {
    number * number
}

fn function_with_return(number: i32) -> i32 {
    let s = square(number);
    println!("{} squared is {}", number, s);  // Made the output message more dynamic
    s
}

fn main() {
    println!("Hello, world!");  // Removed \n as println! already adds a newline
    
    variable_examples();
    control_flow();
    println!("15 + 5 is {}", functions(15));
    let result = function_with_return(4);  // Capturing the return value
    println!("The final result is: {}", result);  // Using the return value
}