export interface UploadResult {
    fileID:        number
    state:         string
    okRows:        number
    errorRows:     number
    emptyRows:     number
    processedRows: number
    error:         string
}

export interface CalculationStatus {
    jobRunning: boolean
    dataSaved:  boolean

    searchCompleted:      boolean
    calculationCompleted: boolean

    metersFoundRows: number
    calculatedRowsCurrent:  number
    calculatedRowsTotal:  number
}

export interface RadioIndicationsInfo {
    id:            number
    sysdate:       string
    excelFilename: string

    rowsTotal:     number
    rowsOk:        number
    meters:        number
    meterReadings: number
}

export interface RadioIndicationError {
    rowIndex:      number
    meterNumber:   string
    meterReadings: number
    receiveDate:   string
    sistemaId:     number
    nrContract:    string
    address:       string
    errorText:     string
}
