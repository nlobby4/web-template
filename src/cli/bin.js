#!/usr/bin/env node

import config from "./config.json" with { type: "json" };
globalThis.cli = config;
let test = 1;
test = "2";
console.log(test);

const testString = "test";

//make badges on readme link to documentations
//fix eslint globalThis
//make eslint check types
//add --help on windows
//add --version on windows
//check if man works on linux

//jest tests
//playwright

console.log(cli.example);

const exampleObject = {
  test: "test",
  test2: "test2",
  test3: "test3",
};
