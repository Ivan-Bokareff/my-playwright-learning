function getTimeout(seconds: number): number {
  return seconds * 1000;  // Hint: look at the return type
}

const config = { baseURL: "https://staging.example.com" };
console.log(config.baseURL);  // Hint: case matters

type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const productA: Product = {
  name: "Wireless Mouse",
  price: 29.99,
  inStock: true,
};

const productB: Product = {
  name: "Mechanical Keyboard",
  price: 89.99,
  inStock: false,
};

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function printName(name: string) {
  console.log(name);
}
const userName: string = "Guest";
printName(userName);  // Hint: what if userName is undefined?


