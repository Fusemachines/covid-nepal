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
    if (!record["Hospital Name"].trim().length) return null;

    const contacts = !!record["contacts"] ? record["contacts"].trim().replace(/,+$/g, "").split(',').map((contactNumber: string) => contactNumber.trim()) : [];
    let district = record["district"] ? record["district"].trim().toLowerCase() : "";
    district = capitalize(district);
    let hospitalType = record["hospitalType"] ? record["hospitalType"].trim().toLowerCase() : "";
    hospitalType = capitalize(hospitalType);
    let totalNumberOfBed = record["totalBeds"] ? record["totalBeds"].trim().match(/\d+/)[0] : null;
    
    let ventilators = null;
    if (record["Ventilators"] && record["Ventilators"].trim().match(/\d+/) != null) {
        ventilators = record["Ventilators"].trim().match(/\d+/)[0];
    }

    return {
        name: record["Hospital Name"].trim(),
        hospitalType: hospitalType,
        availableTime: record["availableTime"] ? [record["availableTime"].trim()] : [],
        openDays: record["openDays"],
        location: record["location"],
        mapLink: record["mapLink"],
        totalBeds: totalNumberOfBed,
        availableBeds: record["availableBeds"],
        covidTest: filterBooleanData(record["covidTest"]),
        testingProcess: record["testingProcess"],
        govtDesignated: filterBooleanData(record["govtDesignated"]),
        numIsolationBeds: record["numIsolationBeds"] ? Number(record["numIsolationBeds"].trim()) : null,
        ventilators,
        nameSlug: record["nameSlug"].trim(),
        icu: record["icu"],
        contact: contacts,
        focalPoint: record["focalPoint"],
        province: {
            code: Number(record["province code"].trim()),
            name: record["province name"].trim()
        },
        district
    }
}

function filterBooleanData(record: string = ""): null | boolean {
    if (!record.length) return null;
    record = record.trim().toLowerCase();

    if (record === "true") return true;
    if (record === "false") return false;
}
