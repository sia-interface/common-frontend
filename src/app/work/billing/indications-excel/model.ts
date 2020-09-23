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
    calculatedRows:  number
}

export interface RadioIndicationsInfo {
    id:            number
    sysdate:       string
    excelFilename: string
}