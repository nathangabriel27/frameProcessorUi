
export type DataType = 'base64' | 'path';
export type FilterTypes = 'blackAndWhite' | 'shadesGray' | 'normal';
export type StatusReturn = {
    status: 'success' | 'mensage';
    mensage: string; // Se === success retornar ''
}

export type FilterSimpleProps = {
    uri: string;
//    uriOriginal: boolean // Default false
//    type: DataType;
    filter: FilterTypes
}

export type FilterSimpleResult = {
    data: FilterSimpleData;
    status: StatusReturn
}
export type FilterSimpleData = {
    uri: string;
    initialUri: null | string;
    type?: DataType; // Default base64
    filter: FilterTypes;
}

export type FilterListProps = {
    uri: string;
    uriOriginal?: boolean // Default false
    type?: DataType; // Default base64
    filter: FilterTypes[]
}

export type FilterListResult = {
    data: FilterListData;
    status: StatusReturn;
}
export type FilterListData = {
    uriList: FilterListUriList[];
    initialUri: null | string; // Se uriOriginal == false, retornar null
}
export type FilterListUriList = {
    id: number;
    uri: string;
    type: DataType; // Default base64
    filter: FilterTypes
}

export type SettingsRoutesParams = {
    Settings: undefined;
    SettingsCamScreen: undefined
    SettingsPreviewScreen: { base64: string }
    Profile: undefined;
    Sac: undefined;
    ProfileResetPassword: undefined;
    SettingsProfileUpdate: undefined
};

