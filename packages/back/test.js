const string = "[@id=\"post-3463463463465\"]";
const pattern = /\[@id=(.+?)\]/;

const match = string.match(pattern);


// console.log(match);

console.log(match[1]);