'use strict'
const debug = require('debug')('aws-tts')
const fs = require('fs-extra')
const path = require('path');//to know extensions
// var readStream = fs.createReadStream(currentFile, "utf8");
var data = "";
const {
  checkUsage,
  generateSpeech_us,
  generateSpeech_ind,
  generateSpeech_bri,
  getSpinner,
  readText,
  sanitizeOpts,
  splitText
} = require('./lib')

var folder = process.argv[2];
//makes a dirname
// function checkDirectorySync(directory) {  
//   try {
//     fs.statSync(directory);
//   } catch(e) {
//     fs.mkdirSync(directory);
//   }
// }

var traverseFileSystem = function (currentFile) {
let outputFilename_us;
let outputFilename_bri;
let outputFilename_ind;
const maxCharacterCount = 1500
debug('called with arguments', JSON.stringify(sanitizeOpts(currentFile)))

//gets only file name without extension
 var filename=path.parse(currentFile).name;
//make folder with textfilename
var foldername="audioFiles";
// If only 1 argument was given, use that for the output filename.
if (!outputFilename_us) {
  outputFilename_us = filename+"_en-US.mp3";
   //input = null
}
if (!outputFilename_ind) {
  outputFilename_ind = filename +"_en-IN.mp3"
 //input = null
}
if (!outputFilename_bri) {
  outputFilename_bri = filename +"_en-GB.mp3"
  //input = null
}
debug('input:', currentFile)
debug('output:',outputFilename_us)
debug('output:',outputFilename_ind)
debug('output:',outputFilename_bri)

let spinner = getSpinner()

// Check the usage.
checkUsage(currentFile, process)
// checkDirectorySync(foldername)
// Generate the audio file with joanna .
readText(currentFile, process).then(text => {
  return splitText(text, maxCharacterCount, currentFile)//removing html tags and decoding
}).then(parts => {
  return generateSpeech_us(parts, currentFile)
}).then(tempFile => {
  var currentfile=foldername+"/"+outputFilename_us
  debug(`copying ${tempFile} to ${currentfile}`)
  fs.move(tempFile, currentfile, { overwrite: true }, () => {
    spinner.succeed(`Done. Saved to ${currentfile}`)
  })
}).catch(err => {
  spinner.info(err.message)
})
// Generate the audio file with raveena.
readText(currentFile, process).then(text => {
  return splitText(text, maxCharacterCount, currentFile)//removing html tags and decoding
}).then(parts => {
  return generateSpeech_ind(parts, currentFile)
}).then(tempFile => {
  var currentfile=foldername+"/"+outputFilename_ind
  debug(`copying ${tempFile} to ${currentfile}`)
  fs.move(tempFile, currentfile, { overwrite: true }, () => {
    spinner.succeed(`Done. Saved to ${currentfile}`)
  })
}).catch(err => {
  spinner.info(err.message)
})
// Generate the audio file with amy.
readText(currentFile, process).then(text => {
  return splitText(text, maxCharacterCount, currentFile)//removing html tags and decoding
}).then(parts => {
  return generateSpeech_bri(parts, currentFile)
}).then(tempFile => {
  var currentfile=foldername+"/"+outputFilename_bri
  debug(`copying ${tempFile} to ${currentfile}`)
  fs.move(tempFile, currentfile, { overwrite: true }, () => {
    spinner.succeed(`Done. Saved to ${currentfile}`)
  })
}).catch(err => {
  spinner.info(err.message)
})
 };
 function readdir(folder){
   var files = fs.readdirSync(folder);
  for (var i in files) {
    var currentFile = folder + '/' + files[i];
    var stats = fs.statSync(currentFile);
    if (stats.isFile()) {
      console.log("\n");
     console.log("I am here :"+currentFile);
    console.log("\n");
     traverseFileSystem(currentFile);
    }
 }
}
readdir(folder);
