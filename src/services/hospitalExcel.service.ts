/**
 * Capitalize string
 * @param str 
 */
function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * prepare Json file of hospital data
 * @param options
 */
export function prepareJsonFileImport(options: { data: any, query: { insertAll:boolean, from: number | undefined, to: number | undefined } }){

    let newRecords:any = []
    for(let record of options.data) {
        let key = Number(record["S/No"]['']);

        // import all
        if (options.query.insertAll) {
            const preparedData = prepareData(record);
            if (preparedData !== null) {
                newRecords.push(preparedData)
            }
        }

        // partial import
        if (!options.query.insertAll && options.query.from < options.query.to && key >= options.query.from && key <= options.query.to) {
            const preparedData = prepareData(record);
            if (preparedData !== null) {
                newRecords.push(preparedData)
            }
        }
    }

    global.logger.log({
        level: "info",
        message: options.query.insertAll ? "Importing all data" : `Partially importing data from ${options.query.from} to ${options.query.to}`
    })

    return newRecords;
}

export function prepareJsonFileUpdate(options: { data: any }){
    let newRecords:any = [];
    let updatedSerialNumbers = [];

    for(let record of options.data) {
        if (record["Update in DB"] && record["Update in DB"] === "1") {
            
            let key = Number(record["S/No"]['']);
            const preparedData = prepareData(record);

            if (preparedData !== null) {
                updatedSerialNumbers.push(key);
                newRecords.push(preparedData)
            }
        }
    }

    global.logger.log({
        level: "info",
        message: `Updating hospital json file records.`
    })
    
    return {
        data: newRecords,
        sn: updatedSerialNumbers
    };
}

export function prepareData(record:any) {
    // return null if hospital name is not present
    if (!record["Hospital Name"].trim().length || !record["nameSlug"].trim().length || !record["province code"].trim().length) {
        return null;
    };
    
    const contacts = !!record["contacts"] ? record["contacts"].trim().replace(/,+$/g, "").split(',').map((contactNumber: string) => getMultiLangVal(contactNumber.trim())) : [];
    let district = record["district"] ? record["district"].trim().toLowerCase() : "";
    district = capitalize(district);
    let hospitalType = record["hospitalType"] ? record["hospitalType"].trim().toLowerCase() : "";
    hospitalType = capitalize(hospitalType);
    let isVerified = false;
    if (record['Verified'] && record['Verified'].trim() == "Verified") {
        isVerified = true;
    }

    let totalNumberOfBed = null;
    if (record["Total Beds"].trim().length) {
        const bedNumbers = record["Total Beds"].trim().match(/\d+/);
        if (bedNumbers != null) {
            totalNumberOfBed = record["Total Beds"].trim().match(/\d+/)[0];
        } 
    }
    
    let ventilators = null;
    if (record["Ventilators"] && record["Ventilators"].trim().match(/\d+/) != null) {
        ventilators = record["Ventilators"].trim().match(/\d+/)[0];
    }
    
    return {
        name: getMultiLangVal(record["Hospital Name"].trim()),
        hospitalType: getMultiLangVal(hospitalType),
        availableTime: record["availableTime"] ? [getMultiLangVal(record["availableTime"].trim())] : [],
        openDays: getMultiLangVal(record["openDays"]),
        location: getMultiLangVal(record["location"]),
        mapLink: record["mapLink"],
        totalBeds: totalNumberOfBed,
        availableBeds: getNumberFromRecord(record["Available Beds"]),
        covidTest: filterBooleanData(record["covidTest"]),
        testingProcess: record["testingProcess"] ? getMultiLangVal(record["testingProcess"]) : null,
        govtDesignated: filterBooleanData(record["Govt Designated"]),
        numIsolationBeds: getNumberFromRecord(record["Num Isolation Beds"]),
        ventilators,
        nameSlug: record["nameSlug"].trim(),
        icu: getNumberFromRecord(record["ICU"]),
        contact: contacts,
        focalPoint: getMultiLangVal(record["Focal Point"]),
        province: {
            code: getNumberFromRecord(record["province code"]),
            name: getMultiLangVal(record["province name"].trim())
        },
        district: getMultiLangVal(district),
        isVerified,
        authorizedCovidTest: filterBooleanData(record["authorizedCovidTest"]) != null ? filterBooleanData(record["authorizedCovidTest"]) : false,
        priority: getNumberFromRecord(record["Hospital priority"])
    }
}

function filterBooleanData(record: string = ""): null | boolean {
    if (!record.length) return null;
    record = record.trim().toLowerCase();

    if (record == "1" || record == "true") return true;
    if (record == "0" || record == "false") return false;
}

function getNumberFromRecord(record:string = "") :any {
    let recordNumber:any = "";
    if (!record.trim().length) {
        recordNumber = null;
    }

    recordNumber = record.trim().match(/\d+/);
    if (recordNumber != null) {
        recordNumber = Number(recordNumber[0]);
    }

    return recordNumber;
}

function getMultiLangVal(record: any) {
    return {
        en: record,
        np: ''
    }
}