export interface ClimateDataRow {
    Province:   string;
    Latitude:   string;
    DB_OutMax:  string;
    WB:         string;
    DBRange:    string;
    DB_In:      string;
    RH_Out:     string;
    W_Out:      string;
    W_In:       string;
    T_o:        string;

    [key: string]: string;
}