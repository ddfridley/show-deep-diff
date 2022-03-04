"use strict;"

// show all the differences between between obj1 and obj2 recursively
// show is the function to call to output differences to, defaults to console.info
// path is the name of the parent property - usually undefined at the start of a compare but you can add something if it helps
// return the number of differences found

function pathToShow(path, key) {
  return path ? path + "." + key : key
}
function pathToShow_(path, key) {
  return pathToShow(path, key) + ":"
}

function showDeepDiff(obj1, obj2, show = console.info, path = "") {
  var differences = 0
  const obj1Keys = Object.keys(obj1)
  obj1Keys.forEach((key) => {
    if (obj1[key] && typeof obj1[key] === "object" && obj1[key] !== null) {
      // it's an object
      if (obj2[key] && typeof obj2[key] === "object" && obj2[key] !== null) {
        // it's an object too
        differences += showDeepDiff(
          obj1[key],
          obj2[key],
          show,
          pathToShow(path, key)
        )
      } else {
        show(
          pathToShow_(path, key),
          JSON.stringify(obj1[key]),
          "!==",
          obj2[key]
        )
        differences++
      }
    } else {
      // obj1[key] is not an object
      if (typeof obj1[key] === "undefined") {
        // there is a key present, but it's value is undefined
        if (typeof obj2[key] === "object" && obj2[key] !== null) {
          show(
            pathToShow_(path, key),
            obj1[key],
            "!==",
            JSON.stringify(obj2[key])
          )
          differences++
        } else if (Object.keys(obj2).includes(key)) {
          // the key is present in obj2 and it's not an object
          if (typeof obj2[key] !== "undefined") {
            show(pathToShow_(path, key), obj1[key], "!==", obj2[key])
            differences++
          }
        } else {
          show(pathToShow_(path, key), obj1[key], "!==", "not present")
          differences++
        }
      } else if (typeof obj2[key] === "object" && obj2[key] !== null) {
        show(
          pathToShow_(path, key),
          obj1[key],
          "!==",
          JSON.stringify(obj2[key])
        )
        differences++
      } else if (obj1[key] !== obj2[key]) {
        if (Object.keys(obj2).includes(key))
          show(pathToShow_(path, key), obj1[key], "!==", obj2[key])
        else show(pathToShow_(path, key), obj1[key], "!==", "not present")
        differences++
      }
    }
  })
  Object.keys(obj2).forEach((key) => {
    // handle keys in obj2 that weren't in obj1
    if (!obj1[key] && !obj1Keys.includes(key)) {
      // both because keys might have a value of undefined or null, or false the first is fast, the seconds checks for accuracy
      if (typeof obj2[key] === "object" && obj2[key] !== null)
        show(
          pathToShow_(path, key),
          "not present",
          "!==",
          JSON.stringify(obj2[key])
        )
      else show(pathToShow_(path, key), "not present", "!==", obj2[key])
      differences++
    }
  })
  return differences
}

module.exports = showDeepDiff

/** uncomment for testing

function foo(){
}

const a={
    propEq: 1,
    propNe: 0,
    oEq: {
        p: 'str',
        b: 'why'
    },
    oNE: {
        p: 'str',
        b: 'why'
    },
    nullEq: null,
    nullNe: false,
    aNe: [1,2,{a: 1, b: 3}],
    c: null,
    d: undefined,
    //e: not present
    fNe: ()=>{'not equal'},
    g: foo,
    hNe: {},
    jNe: null,
    kNe: [],
    zEq: {
        propEq: 1,
        propNe: 0,
        oEq: {
            p: 'str',
            b: 'why'
        },
        oNE: {
            p: 'str',
            b: 'why'
        },
        nullEq: null,
        nullNe: false,
        a: [1,2,{a: 1, b: 3}],
        c: null,
        d: undefined,
        //e: not present
        fNe: ()=>{'not equal'},
        g: foo,
        h: {},
        j: null,
        k: []
    }
}

const b={
    propEq: 1,
    propNe: 1,
    oEq: {
        p: 'str',
        b: 'why'
    },
    oNE: {},
    nullEq: null,
    nullNe: false,
    aNe: [1,2,{a: 1, b: {a: 1, b: [1,'2','3']}}],
    c: null,
    d: undefined,
    eNe: undefined,
    fNe: ()=>{'not equal'},
    g: foo,
    hNe: {
        i: undefined
    },
    jNe: {},
    kNe: ['3','5','y'],
    zEq: {
        propEq: 1,
        propNe: 0,
        oEq: {
            p: 'str',
            b: 'why'
        },
        oNE: {
            p: 'str',
            b: 'why'
        },
        nullEq: null,
        nullNe: false,
        a: [1,2,{a: 1, b: 3}],
        c: null,
        d: undefined,
        //e: not present
        fNe: ()=>{'not equal'},
        g: foo,
        h: {},
        j: null,
        k: []
    }
}

var v=showDeepDiff(a,b)
console.info("result",v);
**/
