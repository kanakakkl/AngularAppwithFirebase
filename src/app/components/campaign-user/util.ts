import { Injectable } from '@angular/core';
 
@Injectable()
export class FileUtil {
 
    constructor() {}
 
    isCSVFile(file) {
        return file.name.endsWith(".csv");
    }
 
    getHeaderArray(csvRecordsArr, tokenDelimeter) {   console.log("here3")
        let headers = csvRecordsArr[0].split(tokenDelimeter);
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }
 
    validateHeaders(origHeaders, fileHeaaders) {console.log("here5")
        if (origHeaders.length != fileHeaaders.length) {
            return false;
        }
 
        var fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {

            origHeaders[j] = origHeaders[j].replace(/\s/g, "");

            fileHeaaders[j] = fileHeaaders[j].replace(/\s/g, "");

            if (origHeaders[j] != fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        console.log("fileHeaderMatchFlag",fileHeaderMatchFlag);
        return fileHeaderMatchFlag;
    }
 
    getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength, 
        validateHeaderAndRecordLengthFlag, tokenDelimeter, tostr, spinner) {console.log("here4")
        var dataArr = []
 
        for (let i = 0; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(tokenDelimeter);
            if(validateHeaderAndRecordLengthFlag && data.length != headerLength){
                if(data==""){
                    tostr.error("Extra blank line is present at line number "+i+", please remove it.");
                    spinner.hide();
                    return null;
                }else{
                    tostr.error("Record at line number "+i+" contain "+data.length+" tokens, and is not matching with header length of :"+headerLength);
                    spinner.hide();
                    return null;
                }
            }

            if(validateHeaderAndRecordLengthFlag && data[i] != null && data[i].trim() == ""){
                tostr.error("Extra blank line is present at line number "+i+", please remove it.");
                spinner.hide();
                return null;
            }
 
            let col = [];
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
            dataArr.push(col);
        }   
        return dataArr;
    }
 
}