import { sharedFunc, SharedType } from "@webrtc-file-transfer/shared";

console.log("This is the index script.");

let x: SharedType;
x = "asdf";
console.log(x);
x = 10;
console.log(x);
sharedFunc();
